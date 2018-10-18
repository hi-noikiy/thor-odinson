import { MyOrder, PingppPaymentCredential, Product } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient, ServiceError } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { GetOrderRequest, Order } from '@xrc-inc/buy-sdk/ecnova/api/shansong/v1/shansong_proto/shansong_pb'
import { ShansongClient } from '@xrc-inc/buy-sdk/ecnova/api/shansong/v1/shansong_proto/shansong_pb_service'
import { grpc } from 'grpc-web-client'
import { action, computed, observable, runInAction } from 'mobx'

import { parseMoneyToFloat, promisify } from '../utils'

import { AccountStore } from './auth'
import { newGetMyOrderRequestFromObject, newPayMyOrderWithPingppRequestFromObject } from './datamodel'
import { StorefrontStore } from './storefront'
import { formatDate, parseTimestamp } from './utils'

export class OrderStore {

  @computed get loaded(): boolean {
    return !!this.order
  }
  @computed get name() {
    return `${this.stf.name}/orders${this.id}`
  }

  @computed get totalNumber(): number {
    return this.lineItems.reduce((t, li) => {
      t = t + li.getQuantity()
      return t
    }, 0)
  }

  @observable public loading: boolean = true
  @observable public error?: ServiceError
  @observable public order?: MyOrder
  @observable public ssOrder?: Order
  @observable public lineItems: OrderLineItem[] = []

  private cli: BuyServiceClient
  private ssCli: ShansongClient
  private accountStore: AccountStore
  private stf: StorefrontStore
  private id: string

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, accountStore: AccountStore, ssCli: ShansongClient, id: string) {
    this.cli = cli
    this.ssCli = ssCli
    this.accountStore = accountStore
    this.stf = storefront
    this.id = id
  }

  @action public async load() {
    this.loading = true
    const jwt = await this.accountStore.allocateJWT()
    const req = newGetMyOrderRequestFromObject({
      orderId: this.id,
      storefront: this.stf.name,
    })
    try {
      const resp = await new Promise<MyOrder>((resolve, reject) => {
        this.cli.getMyOrder(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
      runInAction(() => {
        this.order = resp
        this.lineItems = this.order.getLineItemsList().map(lineItem => new OrderLineItem(lineItem))
        if (this.order!.getStatus() !== 0) {
          this.getShanSongOrder()
        }
      })
    } catch (e) {
      runInAction(() => {
        this.error = e
      })
    } finally {
      runInAction(() => {
        this.loading = false
      })
    }
  }

  @action public async getShanSongOrder() {
    const jwt = await this.accountStore.allocateJWT()
    const req = new GetOrderRequest()
    const fullfillmentOrders = this.order!.getFullfillmentOrdersList()
    if (!fullfillmentOrders.length) {
      return
    }
    const parcels = fullfillmentOrders[0].getParcelsList()
    if (!parcels.length) {
      return
    }
    req.setName(parcels[0].getShansong())
    try {
      const resp = await new Promise<Order>((resolve, reject) => {
        this.ssCli.getOrder(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
      runInAction(() => {
        this.ssOrder = resp
      })
    } catch (err) {
      runInAction(() => {
        this.error = err
      })
    }
  }

  @action public setOrder(order: MyOrder) {
    this.order = order
    this.loading = false
    this.error = undefined
  }

  public async payWithWxWap() {

  }

  public async payWithWxPub(openId: string) {
    const jwt = await this.accountStore.allocateJWT()
    return await promisify<PingppPaymentCredential, ServiceError>(cb => {
      const req = newPayMyOrderWithPingppRequestFromObject({
        storefront: this.stf.name,
        orderId: this.id,
        wxPub: {
          openId,
        },
      })
      this.cli.payMyOrderWithPingpp(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
    })
  }

  /**
   * 获取 AlipayWap 方式支付订单的支付凭证
   */
  public async payWithAlipayWap() {
    const jwt = await this.accountStore.allocateJWT()
    return await promisify<PingppPaymentCredential, ServiceError>(cb => {
      const req = newPayMyOrderWithPingppRequestFromObject({
        storefront: this.stf.name,
        orderId: this.id,
        alipayWap: {
          cancelUrl: `${location.origin}/orders/${this.id}/callback/alipay/cancel`,
          successUrl: `${location.origin}/orders/${this.id}/callback/alipay/success`,
          useAppPay: false,
        },
      })
      this.cli.payMyOrderWithPingpp(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
    })
  }

  public getRecipient() {
    return this.order!.getRecipient()
  }

  public getStatus() {
    return this.order!.getStatus()
  }

  public getGrandTotal() {
    return parseMoneyToFloat(this.order!.getGrandTotal())
  }

  public getShippingSubtotal() {
    return parseMoneyToFloat(this.order!.getShippingSubtotal())
  }

  public getProductsSubtotal() {
    return parseMoneyToFloat(this.order!.getProductsSubtotal())
  }

  public getId() {
    return this.order!.getId()
  }

  public getCreateTime() {
    return formatDate(parseTimestamp(this.order!.getCreateTime()))
  }

  public getPayTime() {
    return formatDate(parseTimestamp(this.order!.getPaymentsList()[0].getPayTime()))
  }

  public getCustomerComments() {
    return this.order!.getCustomerComments()
  }
}

export class OrderLineItem {
  @computed get attributes(): string[] {
    const attrs = []
    const color = this.lineItem.getVariant()!.getColor()
    if (color) {
      attrs.push(color.getDisplayName())
    }
    const size = this.lineItem.getVariant()!.getSize()
    if (size) {
      attrs.push(size)
    }
    return attrs
  }

  @observable private lineItem: MyOrder.LineItem
  constructor(lineItem: MyOrder.LineItem) {
    this.lineItem = lineItem
  }

  public getLineItem() {
    return this.lineItem
  }

  public getSkuId(): string {
    return this.lineItem.getSkuId()
  }
  public getTitle(): string {
    return this.lineItem.getTitle()
  }
  public getImageUrl(): string {
    return this.lineItem.getVariant()!.getImageUrl()
  }
  public getPrice(): number {
    return parseMoneyToFloat(this.lineItem.getPrice())
  }
  public getQuantity(): number {
    return this.lineItem.getQuantity()
  }
  public getShippingLabel(): string {
    return this.lineItem.getShippingLabel()
  }
  public getVariant(): Product.Variant | undefined {
    return this.lineItem.getVariant()
  }
}
