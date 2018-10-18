import { MyCheckout, MyShoppingCart, Product } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { action, computed, observable } from 'mobx'

import { parseMoneyToFloat } from '../utils'

import { CheckoutLineItem } from './checkout'
import { newMyCheckoutLineItemFromObject } from './datamodel'
import { ShoppingCartStore } from './shopping-cart'

export interface ICartItemLine {
  readonly isSelected: boolean
  readonly attributes: string[]
  lineItem: MyShoppingCart.LineItem
  setLineItem(lineItem: MyShoppingCart.LineItem): void
  selectForCheckout(): Promise<any>
  unselect(): Promise<any>
  adjustQuantity(quantity: number): Promise<any>
  getSkuId(): string
  getTitle(): string
  getImageUrl(): string
  getUnavailable(): boolean
  getQuantity(): number
  getPrice(): number
  getVariant(): Product.Variant
  toCheckoutLineItem(): CheckoutLineItem
}

export class LineItem implements ICartItemLine {
  @computed get isSelected() {
    const skuIds = this.cart.checkout.lineItems.map(li => li.getSkuId())
    return !!skuIds.find(id => id === this.getSkuId())
  }
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

  @observable public lineItem: MyShoppingCart.LineItem
  @observable private inLocal: boolean = false
  @observable private cart: ShoppingCartStore

  constructor(shoppingCart: ShoppingCartStore, lineItem: MyShoppingCart.LineItem) {
    this.cart = shoppingCart
    this.lineItem = lineItem
  }

  @action
  public setLineItem(lineItem: MyShoppingCart.LineItem) {
    this.lineItem = lineItem
  }

  @action
  public selectForCheckout() {
    this.cart.checkout.lineItems.push(this.toCheckoutLineItem())
    return this.cart.checkout.update()
  }

  @action
  public async unselect() {
    const index = this.cart.checkout.lineItems.findIndex(li => li.getSkuId() === this.getSkuId())
    this.cart.checkout.lineItems.splice(index, 1)
    this.cart.checkout.update()
  }

  // TODO(j): LineItem 左滑删除时调用此方法
  // @action
  // public async remove() {
  //   if (this.isSelected) {
  //     this.unselect()
  //   }
  //   const index = this.cart.lineItems.findIndex(li => li.getSkuId() === this.getSkuId())
  //   this.cart.lineItems.splice(index, 1)
  // }

  @action.bound
  public async adjustQuantity(quantity: number) {
    this.lineItem.setQuantity(quantity)
    if (this.inLocal) {
      return
    }
    return this.cart.addSKU(this.getSkuId(), quantity)
  }

  public getSkuId() {
    return this.lineItem.getSkuId()
  }
  public getTitle() {
    return this.lineItem.getTitle()
  }
  public getImageUrl() {
    return this.lineItem.getImageUrl()
  }
  public getUnavailable() {
    return this.lineItem.getUnavailable()
  }
  public getQuantity() {
    return this.lineItem.getQuantity()
  }
  public getPrice() {
    return parseMoneyToFloat(this.lineItem.getPrice())
  }
  public getVariant() {
    return this.lineItem.getVariant()!
  }

  public toCheckoutLineItem(): CheckoutLineItem {
    const itm = newMyCheckoutLineItemFromObject({
      imageUrl: this.getImageUrl(),
      price: this.lineItem.getPrice()!.toObject(),
      quantity: this.getQuantity(),
      shippingLabel: this.lineItem.getVariant()!.getShippingLabel(),
      shipppingWeight: this.lineItem.getVariant()!.getShippingWeight(),
      skuId: this.getSkuId(),
      title: this.getTitle(),
      unavailable: this.getUnavailable(),
      variant: this.getVariant()!.toObject(),
    })
    return new CheckoutLineItem(itm, this.cart.checkout)
  }
}

export class LocalLineItem extends LineItem implements ICartItemLine {
  @computed get isSelected() {
    return this.selected
  }
  @observable private selected: boolean = false
  @observable private quantity: number

  constructor(cart: ShoppingCartStore, lineItem: MyShoppingCart.LineItem, selected: boolean) {
    super(cart, lineItem)
    this.selected = selected
    this.quantity = lineItem.getQuantity()
  }

  @action
  public async selectForCheckout() {
    this.selected = true
  }

  @action
  public async unselect() {
    this.selected = false
  }

  @action.bound
  public async adjustQuantity(quantity: number) {
    this.quantity = quantity
  }

  public getQuantity() {
    return this.quantity
  }

  public toObject() {
    return {
      lineItem: this.lineItem.toObject(),
      selected: this.selected,
    }
  }
}

export namespace LocalLineItem {
  export interface IAsObject {
    lineItem: MyShoppingCart.LineItem.AsObject
    selected: boolean
  }
}
