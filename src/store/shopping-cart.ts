import { MyCheckout, MyShoppingCart } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { grpc } from 'grpc-web-client'
import { action, autorun, computed, observable, runInAction, untracked } from 'mobx'

import { AccountStore } from './auth'
import { ICartItemLine, LineItem, LocalLineItem } from './cart-line-item'
import { CheckoutStore } from './checkout'
import { newAddSKUToMyShoppingCartRequestFromObject, newGetMyShoppingCartRequestFromObject, newIncreaseSKUQuantityInMyShoppingCartRequestFromObject, newMyCheckoutFromObject, newMyShoppingCartLineItemFromObject, newRemoveSKUsFromMyShoppingCartRequestFromObject, newUpdateMyCheckoutRequestFromObject } from './datamodel'
import { LBSClient } from './lbs'
import { SKU } from './product'
import { StorefrontStore } from './storefront'

export class ShoppingCartStore {
  @computed get lineItems(): ICartItemLine[] {
    if (!this.accountStore.authenticated) {
      return this.localLineItems
    }
    // TODO(j): 合并 remoteLineItems 和 checkout 中的 lineItems 并去重
    return this.remoteLineItems
  }

  /**
   * 选中的商品数量
   */
  @computed get totalNumber(): number {
    return this.lineItems.reduce((t, li) => {
      if (li.isSelected) {
        t = t + li.getQuantity()
      }
      return t
    }, 0)
  }

  /**
   * 购物车商品总价，如果当前已登录，则使用 checkout 中的计算结果，如果未
   * 登录，则使用本地计算的结果
   */
  @computed get grandTotal() {
    if (!this.accountStore.authenticated) {
      return this.localLineItems.reduce((total, li) => {
        if (li.isSelected) {
          total += li.getQuantity() * li.getPrice()
        }
        return total
      }, 0).toFixed(2)
    }
    return this.checkout.getGrandTotal()
  }

  @computed get allSelected(): boolean {
    if (!this.lineItems.length) {
      return false
    }
    if (!this.accountStore.authenticated) {
      for (const li of this.localLineItems) {
        if (!li.isSelected) {
          return false
        }
      }
      return true
    }
    return this.checkout.lineItems.length === this.lineItems.length
  }

  @computed get updating(): boolean {
    return this.updatingCart || this.checkout.updating
  }

  @observable public checkout: CheckoutStore
  @observable public error?: Error
  /** 标识首次加载是否完成 */
  @observable public loading: boolean = false
  @observable private updatingCart: boolean = false
  @observable private remoteLineItems: LineItem[] = []
  @observable private localLineItems: LocalLineItem[] = []
  private shoppingCart?: MyShoppingCart

  private stf: StorefrontStore
  private cli: BuyServiceClient
  private accountStore: AccountStore

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, accountStore: AccountStore, mapCli: LBSClient) {
    this.cli = cli
    this.stf = storefront
    this.accountStore = accountStore
    this.checkout = new CheckoutStore(this.cli, this.stf, this.accountStore, mapCli)
    this.loadLocalLineItems()
    this.startAutoSaveLocalLineItems()
  }

  @action
  public async load() {
    if (!this.accountStore.authenticated) {
      console.warn('Unauthenticated, skip load shopping cart')
      return
    }
    if (this.shoppingCart) {
      this.updatingCart = true
    } else {
      this.loading = true
    }
    let resp: MyShoppingCart
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newGetMyShoppingCartRequestFromObject({ storefront: this.stf.name, view: 1 })
      resp = await new Promise<MyShoppingCart>((resolve, reject) => {
        this.cli.getMyShoppingCart(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (err) {
      console.warn(err)
      runInAction(() => {
        this.loading = false
        this.error = err
      })
      return
    }
    await this.resolveShoppingCart(resp)
  }

  @action
  public async syncLocalShoppingCart() {
    this.updatingCart = true
    let resp: MyShoppingCart | undefined
    for (const li of this.localLineItems) {
      try {
        const jwt = await this.accountStore.allocateJWT()
        const req = newAddSKUToMyShoppingCartRequestFromObject({
          name: `${this.stf.name}/skus/${li.getSkuId()}`,
          quantity: li.getQuantity(),
        })
        resp = await new Promise<MyShoppingCart>((resolve, reject) => {
          this.cli.addSKUToMyShoppingCart(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
            err ? reject(err) : resolve(resp!)
          })
        })
      } catch (error) {
        console.warn('Failed to add local line item to shopping cart:', li.toObject(), error)
        continue
      }
    }
    runInAction(() => {
      this.localLineItems = []
      localStorage.removeItem('LOCAL_LINE_ITEMS')
      if (!resp) {
        this.updatingCart = false
        this.error = undefined
        throw new Error('Failed to add local line item to shopping cart')
      }
      this.resolveShoppingCart(resp)
    })
    return resp
  }

  @action
  public selectAll() {
    if (!this.accountStore.authenticated) {
      this.localLineItems.forEach(li => li.selectForCheckout())
      return
    }
    this.checkout.lineItems = this.lineItems.map(li => li.toCheckoutLineItem())
    return this.checkout.update()
  }

  @action
  public unselectAll() {
    if (!this.accountStore.authenticated) {
      this.localLineItems.forEach(li => li.unselect())
      return
    }
    this.checkout.lineItems = []
    return this.checkout.update()
  }

  @action
  public async addSKU(id: string, quantity: number): Promise<void> {
    if (!this.accountStore.authenticated) {
      this.local_AddSKU(id, quantity)
      return
    }
    this.updatingCart = true
    let resp: MyShoppingCart
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newAddSKUToMyShoppingCartRequestFromObject({ name: `${this.stf.name}/skus/${id}`, quantity })
      resp = await new Promise<MyShoppingCart>((resolve, reject) => {
        this.cli.addSKUToMyShoppingCart(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (error) {
      console.warn(error)
      runInAction(() => {
        this.updatingCart = false
        this.error = error
      })
      return
    }
    this.resolveShoppingCart(resp)
  }

  @action
  public async increaseSKUQuantity(sku: SKU, quantity: number): Promise<void> {
    if (!this.accountStore.authenticated) {
      this.local_IncreaseSKUQuantity(sku, quantity)
      return
    }
    this.updatingCart = true
    let resp: MyShoppingCart
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newIncreaseSKUQuantityInMyShoppingCartRequestFromObject({ name: sku.skuName, quantity })
      resp = await new Promise<MyShoppingCart>((resolve, reject) => {
        this.cli.increaseSKUQuantityInMyShoppingCart(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (error) {
      console.error(error)
      runInAction(() => {
        this.updatingCart = false
        this.error = error
      })
      // return
      throw error
    }
    this.resolveShoppingCart(resp)
  }

  @action.bound
  public async removeSKUs() {
    if (!this.accountStore.authenticated) {
      this.localLineItems = this.localLineItems.filter(li => !li.isSelected)
      return
    }
    const selected = this.lineItems.filter(li => li.isSelected)

    this.updatingCart = true
    let resp: MyShoppingCart
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newRemoveSKUsFromMyShoppingCartRequestFromObject({
        storefront: this.stf.name,
        // TODO(j): 优化拼 name 的操作
        namesList: selected.map(itm => `${this.stf.name}/skus/${itm.getSkuId()}`),
      })
      resp = await new Promise<MyShoppingCart>((resolve, reject) => {
        this.cli.removeSKUsFromMyShoppingCart(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (error) {
      console.error(error)
      runInAction(() => {
        this.updatingCart = false
        this.error = error
      })
      // return
      throw error
    }
    this.resolveShoppingCart(resp)
  }

  @action
  private local_AddSKU(id: string, quantity: number) {
    const li = this.localLineItems.find(li => li.getSkuId() === id)
    if (!li) {
      console.warn('sku not found')
      return
    }
    li.adjustQuantity(quantity)
  }

  @action
  private local_IncreaseSKUQuantity(sku: SKU, quantity: number) {
    let li = this.localLineItems.find(li => {
      return li.getSkuId() === sku.id
    })
    if (!li) {
      const line = new MyShoppingCart.LineItem()
      line.setSkuId(sku.id)
      line.setImageUrl(sku.getVariant().getImageUrl())
      line.setPrice(sku.getVariant().getPrice())
      line.setQuantity(quantity)
      line.setTitle(sku.getVariant().getTitle())
      line.setVariant(sku.getVariant())
      // TODO:
      // line.setUnavailable(value)
      li = new LocalLineItem(this, line, true)
      this.localLineItems.push(li)
      return
    }
    li.adjustQuantity(li.getQuantity() + quantity)
    return
  }

  @action
  private async resolveShoppingCart(resp: MyShoppingCart) {
    this.shoppingCart = resp
    this.loading = false
    this.updatingCart = false
    this.error = undefined
    const chk = await this.cleanCheckout(resp)
    runInAction(() => {
      this.checkout.setCheckout(chk)
      this.remoteLineItems = resp.getLineItemsList().map(li => {
        return new LineItem(this, li)
      })
    })
  }

  @action
  private async cleanCheckout(resp: MyShoppingCart) {
    const chk = resp.toObject().checkout
    if (!chk) {
      return resp.getCheckout()!
    }
    const ids = resp.toObject().lineItemsList.map(li => li.skuId)
    const remainItems = chk.lineItemsList.filter(li => ids.findIndex(id => id === li.skuId) > -1)
    if (remainItems.length === chk.lineItemsList.length) {
      return resp.getCheckout()!
    }
    console.info('Clean checkout: ', remainItems)
    try {
      const jwt = await this.accountStore.allocateJWT()
      return await new Promise<MyCheckout>((resolve, reject) => {
        const req = newUpdateMyCheckoutRequestFromObject({
          storefront: this.stf.name,
          myCheckout: {
            ...chk,
            lineItemsList: remainItems,
          },
        })
        this.cli.updateMyCheckout(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (error) {
      console.warn(error)
      return resp.getCheckout()!
    }
  }

  private loadLocalLineItems() {
    const str = localStorage.getItem('LOCAL_LINE_ITEMS') || '[]'
    const lineItems: LocalLineItem.IAsObject[] = JSON.parse(str)
    this.localLineItems = lineItems.map(li => {
      return new LocalLineItem(this, newMyShoppingCartLineItemFromObject(li.lineItem), li.selected)
    })
  }

  private startAutoSaveLocalLineItems() {
    autorun(() => {
      if (!untracked(() => this.accountStore.authenticated)) {
        console.log('Saving line items...')
        const s = JSON.stringify(this.localLineItems.map(li => li.toObject()))
        localStorage.setItem('LOCAL_LINE_ITEMS', s)
      }
    })
  }
}
