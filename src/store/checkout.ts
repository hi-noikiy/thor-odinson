import { MyCheckout, MyOrder, MyRecipient, Product, UpdateMyCheckoutRequest } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient, ServiceError } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { ShansongClient } from '@xrc-inc/buy-sdk/ecnova/api/shansong/v1/shansong_proto/shansong_pb_service'
import { grpc } from 'grpc-web-client'
import { action, autorun, computed, observable, runInAction } from 'mobx'

import { env } from '../env'
import { parseMoneyToFloat, promisify } from '../utils'

import { AccountStore } from './auth'
import { newMyCheckoutPhysicalProductsFulfillmentDataFromObject, newMyRecipientFromObject, newPlaceOrderRequestFromObject } from './datamodel'
import { LBSClient } from './lbs'
import { OrderStore } from './order'
import { RecipientStore } from './recipient'
import { StorefrontStore } from './storefront'

const pingpp = require('../../src/pingpp.js')

export class CheckoutStore {

  @observable public updating: boolean = false
  @observable public error?: Error
  @observable public selectedRecipientId?: string
  @observable public lineItems: CheckoutLineItem[] = []

  @observable private checkout: MyCheckout

  @computed get totalNumber(): number {
    return this.lineItems.reduce((t, li) => {
      t = t + li.getQuantity()
      return t
    }, 0)
  }

  @computed get loaded(): boolean {
    return !!this.checkout.getLineItemsList().length
  }

  private cli: BuyServiceClient
  private stf: StorefrontStore
  private mapCli: LBSClient
  private accountStore: AccountStore

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, accountStore: AccountStore, mapCli: LBSClient, checkout?: MyCheckout) {
    this.cli = cli
    this.mapCli = mapCli
    this.stf = storefront
    this.accountStore = accountStore
    if (checkout) {
      this.checkout = checkout
      return
    }
    this.checkout = new MyCheckout()
    this.checkout.setStorefront(storefront.name)
    this.startAutoSyncLineItems()
  }

  @action public setCheckout(checkout: MyCheckout) {
    this.checkout = checkout
    this.lineItems = checkout.getLineItemsList().map(li => new CheckoutLineItem(li, this))
  }

  @action public setLineItem(lineItem: MyCheckout.LineItem) {
    this.checkout.setLineItemsList([lineItem])
    this.setCheckout(this.checkout)
  }

  @action
  public async update() {
    this.updating = true
    let resp: MyCheckout
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = new UpdateMyCheckoutRequest()
      req.setMyCheckout(this.checkout)
      req.setStorefront(this.stf.name)
      resp = await new Promise<MyCheckout>((resolve, reject) => {
        this.cli.updateMyCheckout(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (error) {
      console.warn(error)
      runInAction(() => {
        this.updating = false
        this.error = error
      })
    }
    runInAction(() => {
      this.updating = false
      this.checkout = resp
    })
  }

  @action
  public setRecipient(recipient: MyRecipient) {
    const data = newMyCheckoutPhysicalProductsFulfillmentDataFromObject({
      deliveryOption: 0,
      recipient: recipient.toObject(),
    })
    this.checkout.setPhysicalProductsFulfillmentData(data)
    this.setCheckout(this.checkout)
  }

  @action public setCustomerComments(comment: string) {
    this.checkout.setCustomerComments(comment)
    this.setCheckout(this.checkout)
  }

  @action
  public async placeOrder(): Promise<OrderStore> {
    const jwt = await this.accountStore.allocateJWT()
    const ord = await promisify<MyOrder, ServiceError>(cb => {
      const req = newPlaceOrderRequestFromObject({ storefront: this.stf.name, myCheckout: this.checkout.toObject() })
      this.cli.placeOrder(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
    })
    const store = new OrderStore(this.cli, this.stf, this.accountStore, new ShansongClient(env.ssEndpoint!), ord.getId())
    store.setOrder(ord)
    return store
  }

  @action
  public async createOrderAndPay(orderId: string, selectedPayType: string) {
    // let resp: PingppPaymentCredential
    // const jwt = await this.accountStore.allocateJWT()
    // let payTypeData: PayMyOrderWithPingppRequest.AsObject

    // if (selectedPayType === 'wechat') {
    //   payTypeData = {
    //     storefront: this.stf.name,
    //     orderId,
    //     wxWap: {},
    //   }
    // } else if (selectedPayType === 'ali') {
    //   payTypeData = {
    //     storefront: this.stf.name,
    //     orderId,
    //     alipay: {},
    //   }
    // } else {
    //   return
    // }
    // const data = newPayMyOrderWithPingppRequestFromObject(payTypeData)

    // resp = await new Promise<PingppPaymentCredential>((resolve, reject) => {
    //   this.cli.payMyOrderWithPingpp(data, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
    //     err ? reject(err) : resolve(resp!)
    //   })
    // })
    console.log('ddd')
    const Opaque = { id: 'ch_9ivbnPerTWvHujjP8GHez9qH', object: 'charge', created: 1536394722, livemode: true, paid: false, refunded: false, reversed: false, app: 'app_C0enbHDOq1GS5WHW', channel: 'alipay', order_no: 'DDRtJe6pMgMZiLHRaAqJrb', client_ip: '127.0.0.1', amount: 100, amount_settle: 100, currency: 'cny', subject: '测试支付宝 app', body: '测试1', extra: {}, time_paid: 0, time_expire: 1536481122, time_settle: 0, transaction_no: '', refunds: { object: 'list', has_more: false, url: '/v1/charges/ch_9ivbnPerTWvHujjP8GHez9qH/refunds', data: [] }, amount_refunded: 0, failure_code: '', failure_msg: '', metadata: { ECNOVA_PAYMENT_NAME: 'pingppapps/duotai/payments/RhHC9rJzVhW8YKLo8mCVFo' }, credential: { alipay: { orderInfo: 'service="mobile.securitypay.pay"\u0026_input_charset="utf-8"\u0026notify_url="https%3A%2F%2Fnotify.pingxx.com%2Fnotify%2Fcharges%2Fch_9ivbnPerTWvHujjP8GHez9qH"\u0026partner="2088421500046839"\u0026out_trade_no="DDRtJe6pMgMZiLHRaAqJrb"\u0026subject="测试支付宝 app"\u0026body="测试1 ch_9ivbnPerTWvHujjP8GHez9qH"\u0026total_fee="1.00"\u0026payment_type="1"\u0026seller_id="2088421500046839"\u0026it_b_pay="2018-09-09 16:18:42"\u0026sign="VmX4bgCviddWvtvChgbxZLZnF2%2FOhQb%2FMvGK3e3s0Hlw7647%2BFH7rg77RIed2HWR2Lkeh%2BIqP%2F0lrWzG2NDUOKZs3qSWu1NN17hThw2Xc3g5lKJ4ctFatB9gNib0VQ0xP2lGT9TWP9nr5%2B83vaKFBL%2FmSneSimdSWnxlsYqDLEw%3D"\u0026sign_type="RSA"' }, object: 'credential' }, description: '测试1' }
    pingpp.createPayment(Opaque, (result: string, err: { msg: string, extra: string }) => {
      console.log(result)
      console.log(err.msg)
      console.log(err.extra)
      if (result === 'success') {
        // 只有微信公众号 (wx_pub)、微信小程序（wx_lite）、QQ 公众号 (qpay_pub)支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL
      } else if (result === 'fail') {
        // Ping++ 对象 object 不正确或者微信公众号/微信小程序/QQ公众号支付失败时会在此处返回
      } else if (result === 'cancel') {
        // 微信公众号、微信小程序、QQ 公众号支付取消支付
      }
    })
  }

  public async calcDistance(lng1: any, lat1: any, lng2: any ,lat2: any) {
    const lbsApi = await this.mapCli.api()
    return lbsApi.utils.getDistance(lng1, lat1, lng2, lat2)
  }

  public getCustomerComments() {
    return this.checkout.getCustomerComments()
  }

  public getStorefront() {
    return this.checkout.getStorefront()
  }
  public getLineItemsList() {
    return this.checkout.getLineItemsList()
  }
  public getShippingLinesList() {
    return this.checkout.getShippingLinesList()
  }
  public getPhysicalProductsFulfillmentData() {
    return this.checkout.getPhysicalProductsFulfillmentData()
  }
  public getDigitalProductsFulfillmentData() {
    return this.checkout.getDigitalProductsFulfillmentData()
  }
  public getPaymentMethod() {
    return this.checkout.getPaymentMethod()
  }
  public getProductsSubtotal() {
    return parseMoneyToFloat(this.checkout.getProductsSubtotal())
  }
  public getProductsDiscount() {
    return this.checkout.getProductsDiscount()
  }
  public getShippingSubtotal() {
    return parseMoneyToFloat(this.checkout.getShippingSubtotal())
  }
  public getShippingDiscount() {
    return this.checkout.getShippingDiscount()
  }
  public getGrandTotal() {
    if (!this.accountStore.authenticated) {
      let total = 0.0
      this.lineItems.forEach(li => {
        total += li.getPrice() * li.getQuantity()
      })
      return total
    }
    return parseMoneyToFloat(this.checkout.getGrandTotal())
  }
  public getIsValid() {
    return this.checkout.getIsValid()
  }
  public getCnDigitalInvoice() {
    return this.checkout.getCnDigitalInvoice()
  }

  public getRecipient() {
    const physicalProductsFulfillmentData = this.getPhysicalProductsFulfillmentData()
    if (!physicalProductsFulfillmentData) {
      return
    }
    return physicalProductsFulfillmentData.getRecipient()
  }

  private startAutoSyncLineItems() {
    autorun(() => {
      this.checkout.setLineItemsList(this.lineItems.map(li => li.getLineItem()))
    })
  }
}

export class CheckoutLineItem {
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

  @observable private lineItem: MyCheckout.LineItem
  @observable private checkout?: CheckoutStore
  constructor(lineItem: MyCheckout.LineItem, checkout?: CheckoutStore) {
    this.checkout = checkout
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
  public getUnavailable(): boolean {
    return this.lineItem.getUnavailable()
  }
  public getShippingLabel(): string {
    return this.lineItem.getShippingLabel()
  }
  public getShipppingWeight(): number {
    return this.lineItem.getShipppingWeight()
  }
  public getVariant(): Product.Variant | undefined {
    return this.lineItem.getVariant()
  }
}
