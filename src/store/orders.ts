import { MyOrder, SearchMyOrdersQuery, SearchMyOrdersResponse } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { GetOrderRequest, Order as SSOrder, SyncOrderTrailRequest, SyncOrderTrailResponse, Trail } from '@xrc-inc/buy-sdk/ecnova/api/shansong/v1/shansong_proto/shansong_pb'
import { ServiceError, ShansongClient } from '@xrc-inc/buy-sdk/ecnova/api/shansong/v1/shansong_proto/shansong_pb_service'
import { grpc } from 'grpc-web-client'
import { action, computed, observable, runInAction as ra } from 'mobx'

import { curry, throttle } from '../utils'

import { AccountStore } from './auth'
import { newSearchMyOrdersRequestFromObject } from './datamodel'
import { ILBSClient } from './lbs'
import { StorefrontStore } from './storefront'
import { UIState } from './ui'

export enum OrderStatusGroup {
  UNPAID = '待付款',
  APPLY = '待派发',
  UNDERTAKEN = '进行中',
  COMPLETE = '已完成',
}

const SSOrderStatusDisplayMap = {
  [SSOrder.Status.WAITING_FOR_SERVICE]: '待抢单',
  [SSOrder.Status.WAITING_FOR_PICKUP]: '待取件',
  [SSOrder.Status.READY_TO_PICKUP]: '已就位',
  [SSOrder.Status.DELIVERING]: '派送中',
  [SSOrder.Status.DONE]: '已完成',
  [SSOrder.Status.CANCELLED]: '已取消',
  [SSOrder.Status.STATUS_UNSPECIFIED]: '未指定',
  [SSOrder.Status.NEW]: '待确认',
}

const OrderStatusDisplayMap = {
  [MyOrder.Status.UNPAID]: '待付款',
  [MyOrder.Status.PAID]: '已付款',
  [MyOrder.Status.PARTIALLY_IN_TRANSIT]: '配货中',
  [MyOrder.Status.IN_TRANSIT]: '派送中',
  [MyOrder.Status.COMPLETED]: '已完成',
  [MyOrder.Status.CANCELLED]: '已取消',
}

export interface IOrders {
  loading: boolean
  orders: MyOrder[]
  pageSize: number
  pageToken: string
  ended: boolean
  error: Error | ServiceError | null
  displayName: string
  paymentStatus: number
  shippingStatus: number
  accountStore: AccountStore
  loadMore(): void
  searchMyOrders(query: Partial<SearchMyOrdersQuery.AsObject>): void
  getStatusDisplayName(status: MyOrder.Status): string
}

type EventHandler = (event?: any) => void

class EventEmitter {
  private all: any = Object.create({})

  public on(type: string, handler: EventHandler) {
    if (!this.all[type]) {
      this.all[type] = []
    }
    this.all[type].push(handler)
  }

  public off(type: string, handler: EventHandler) {
    if (this.all[type]) {
      this.all[type].splice(this.all[type].indexOf(handler) >>> 0, 1)
    }
  }

  public emit(type: string, evt: any) {
    if (this.all[type]) {
      this.all[type].map((handler: any) => { handler(evt) })
    }
    if (this.all['*']) {
      this.all['*'].map((handler: any) => { handler(type, evt) })
    }
  }
}

export abstract class Orders extends EventEmitter implements IOrders {
  @observable
  public inited: boolean
  @observable
  public loading: boolean
  @observable
  public orders: MyOrder[]
  @observable
  public ended: boolean
  @observable
  public pageSize: number
  @observable
  public pageToken: string
  @observable
  public error: Error | ServiceError | null

  public displayName: string
  public paymentStatus: number
  public shippingStatus: number
  public accountStore: AccountStore

  private cli: BuyServiceClient
  private storefrontStore: StorefrontStore

  constructor(
    cli: BuyServiceClient,
    accountStore: AccountStore,
    storefrontStore: StorefrontStore,
    displayName: string,
    paymentStatus: number,
    shippingStatus?: number,
  ) {
    super()
    this.cli = cli
    this.accountStore = accountStore
    this.storefrontStore = storefrontStore
    this.displayName = displayName
    this.paymentStatus = paymentStatus
    this.shippingStatus = shippingStatus!
    this.loading = false
    this.inited = false
    this.orders = []
    this.ended = false
    this.pageSize = 10
    this.pageToken = ''
    this.error = null
  }

  @action
  public reset() {
    this.inited = false
    this.loading = false
    this.orders = []
    this.ended = false
    this.pageToken = ''
    this.error = null
  }

  @action
  public getStatusDisplayName(status: MyOrder.Status): string {
    return OrderStatusDisplayMap[status]
  }

  @action
  public async initMyOrders(q: Partial<SearchMyOrdersQuery.AsObject>) {
    if (this.inited) {
      return
    }
    await this.searchMyOrders(q)
    this.inited = true
  }

  public mutateOrders(nos: MyOrder[]) {
    const addons = nos.filter(ro => !this.orders.filter(o => o.getId() === ro.getId()).length)
    for (const addon of addons) {
      this.orders.push(addon)
    }
  }

  public async searchMyOrdersWithNoSideEffect(q: Partial<SearchMyOrdersQuery.AsObject>, pageToken?: string): Promise<SearchMyOrdersResponse> {
    const jwt = await this.accountStore.allocateJWT()
    const md = new grpc.Metadata({ Authorization: `Bearer ${jwt}` })
    const query: Partial<SearchMyOrdersQuery.AsObject> = {}
    if (q.keyword) {
      query.keyword = q.keyword
    }
    if (q.orderStatus) {
      query.orderStatus = q.orderStatus
    }
    if (q.paymentStatus) {
      query.paymentStatus = q.paymentStatus
    }
    if (q.shippingStatus) {
      query.shippingStatus = q.shippingStatus
    }
    if (q.receiptStatus) {
      query.receiptStatus = q.receiptStatus
    }
    const req = newSearchMyOrdersRequestFromObject({
      pageSize: this.pageSize,
      pageToken: pageToken ? pageToken : this.pageToken,
      query: q as SearchMyOrdersQuery.AsObject,
      storefront: this.storefrontStore.name,
    })
    return await curry<SearchMyOrdersResponse>(this.cli.searchMyOrders.bind(this.cli))(req, md)
  }

  @action
  public async searchMyOrders(q: Partial<SearchMyOrdersQuery.AsObject>): Promise<MyOrder[] | undefined> {
    this.loading = true
    try {
      const resp = await this.searchMyOrdersWithNoSideEffect(q)
      const nos = resp.getOrdersList()
      if (nos.length) {
        ra(() => {
          this.mutateOrders(nos)
          this.pageToken = resp.getNextPageToken()
        })
      }
      return nos
    } catch (e) {
      console.error('failed to search my orders, ', e.message)
      ra(() => {
        this.error = e
      })
    } finally {
      ra(() => {
        this.loading = false
      })
    }
  }

  public abstract async loadMore(): Promise<void>
}

enum EVENTS_TYPES {
  ORDER_COMPLETE = 'ORDER_COMPLETE',
  ORDER_UNDERTAKEN = 'ORDER_UNDERTAKEN',
}

export interface IOrdersStore {
  cli: BuyServiceClient
  mcli: ILBSClient
  accountStore: AccountStore
  storefrontStore: StorefrontStore
  types: Map<string, Orders>
  reset(): void
  onTabChange(v: string): void
  getTypesMap(): Array<[string, Orders]>
}

export class OrdersStore implements IOrdersStore {
  public cli: BuyServiceClient
  public mcli: ILBSClient
  public sscli: ShansongClient
  public ui: UIState
  public accountStore: AccountStore
  public storefrontStore: StorefrontStore
  @observable
  public types: Map<string, Orders> = new Map<string, Orders>()

  constructor(cli: BuyServiceClient, sscli: ShansongClient, mcli: ILBSClient, ui: UIState, accountStore: AccountStore, storefrontStore: StorefrontStore) {
    this.cli = cli
    this.sscli = sscli
    this.mcli = mcli
    this.ui = ui
    this.accountStore = accountStore
    this.storefrontStore = storefrontStore

    const ordersUnpaid = new OrdersUnpaid(cli, accountStore, storefrontStore)
    const ordersApply = new OrdersApply(cli, accountStore, storefrontStore)
    const ordersUndertaken = new OrdersUndertaken(cli, mcli, sscli, ui, accountStore, storefrontStore)
    const ordersComplete = new OrdersComplete(cli, accountStore, storefrontStore)

    ordersUndertaken.on(EVENTS_TYPES.ORDER_COMPLETE, ordersComplete.complete.bind(ordersComplete))
    ordersApply.on(EVENTS_TYPES.ORDER_UNDERTAKEN, ordersUndertaken.undertake.bind(ordersUndertaken))

    this.types.set(OrdersUnpaid.displayName, ordersUnpaid)
    this.types.set(OrdersApply.displayName, ordersApply)
    this.types.set(OrdersUndertaken.displayName, ordersUndertaken)
    this.types.set(OrdersComplete.displayName, ordersComplete)
  }

  @action.bound
  public async onTabChange(to: string) {
    const ou = this.types.get(OrdersUndertaken.displayName) as OrdersUndertaken
    const oa = this.types.get(OrdersApply.displayName) as OrdersApply

    if (to === OrdersUndertaken.displayName) {
      ou!.routine()
    } else {
      ou!.unroutine()
    }
    if (to === OrdersApply.displayName) {
      oa!.routine()
    } else {
      oa!.unroutine()
    }
    const order = this.types.get(to)
    try {
      await order!.initMyOrders({ keyword: '' })
    } catch (err) {
      // @todo toast
      this.ui.toast('获取列表失败')
    }
  }

  @action
  public reset() {
    for (const o of this.types.values()) {
      o.reset()
    }
  }

  public getTypesMap() {
    return Array.from(this.types.entries())
  }
}

export class OrdersUnpaid extends Orders {
  public static displayName: string = OrderStatusGroup.UNPAID
  public static paymentStatus: number = SearchMyOrdersQuery.PaymentStatus.UNPAID

  constructor(
    cli: BuyServiceClient,
    accountStore: AccountStore,
    storefrontStore: StorefrontStore,
  ) {
    super(cli, accountStore, storefrontStore, OrdersUnpaid.displayName, OrdersUnpaid.paymentStatus)
  }

  public async searchMyOrders(q: Partial<SearchMyOrdersQuery.AsObject> = {}) {
    return super.searchMyOrders({ keyword: q.keyword, paymentStatus: OrdersUnpaid.paymentStatus })
  }

  public async loadMore() { }
}

export class SSOrderWrp {
  @observable public order: SSOrder | null = null
  @computed get showMap(): boolean {
    if (!this.order) {
      return false
    }
    const { WAITING_FOR_PICKUP, READY_TO_PICKUP, DELIVERING } = SSOrder.Status
    if ([WAITING_FOR_PICKUP, READY_TO_PICKUP, DELIVERING].indexOf(this.order.getStatus()) >= 0) {
      return true
    }
    return false
  }
  constructor(order: SSOrder) {
    this.order = order
  }
}

export class MyOrderUndertaken extends MyOrder {
  @computed get ssStatus(): string {
    if (this.ssOrders.length) {
      const oStatus = this.ssOrders[0].order!.getStatus()
      const status = this.getOrderStatus(oStatus)
      if (status === OrderStatusGroup.UNDERTAKEN) {
        return SSOrderStatusDisplayMap[oStatus]
      }
    }
    return SSOrderStatusDisplayMap[SSOrder.Status.WAITING_FOR_SERVICE]
  }

  @computed get courierPhoneNumber(): string {
    if (!this.ssOrders.length) {
      return ''
    }
    const first = this.ssOrders[0]
    if (!first || !first.order) {
      return ''
    }
    return first.order.getCourierPhoneNumber()
  }

  @observable
  public ssOrders: SSOrderWrp[] = []
  public mapInst: any

  @computed get showMap(): boolean {
    if (!this.ssOrders.length) {
      return false
    }
    return !!this.ssOrders.filter(o => o.showMap).length
  }

  public getOrderStatus(status: SSOrder.Status): string {
    const { CANCELLED, DONE, WAITING_FOR_PICKUP, READY_TO_PICKUP, DELIVERING } = SSOrder.Status
    if ([CANCELLED, DONE].indexOf(status) >= 0) {
      return OrderStatusGroup.COMPLETE
    } else if ([WAITING_FOR_PICKUP, READY_TO_PICKUP, DELIVERING].indexOf(status) >= 0) {
      return OrderStatusGroup.UNDERTAKEN
    }
    return OrderStatusGroup.UNPAID
  }
}

export class OrdersUndertaken extends Orders {
  @computed get infiElsHeight(): number[] | number {
    const arr = this.orders.map(o => {
      const base = this.ui.calRemToPixel(3.92) + 20
      if (!o.ssOrders || !o.ssOrders.length) {
        return base
      }
      return o.ssOrders.reduce((a: number, c: SSOrderWrp) => {
        if (c.showMap) {
          return a + this.ui.calRemToPixel(4.5) + 10
        }
        return a
      }, base)
    })
    return arr.concat([60])
  }
  public static displayName = OrderStatusGroup.UNDERTAKEN
  public static paymentStatus = SearchMyOrdersQuery.PaymentStatus.PAID
  public static shippingStatus = SearchMyOrdersQuery.ShippingStatus.SHIPPED
  public static receiptStatus = SearchMyOrdersQuery.ReceiptStatus.UNRECEIVED
  public static duration = 3 * 1000
  public ui: UIState

  public orders: MyOrderUndertaken[] = []
  private rt: any = null
  private sscli: ShansongClient
  private mcli: ILBSClient

  constructor(
    cli: BuyServiceClient,
    mcli: ILBSClient,
    sscli: ShansongClient,
    ui: UIState,
    accountStore: AccountStore,
    storefrontStore: StorefrontStore,
  ) {
    super(cli, accountStore, storefrontStore, OrdersUndertaken.displayName, OrdersUndertaken.paymentStatus)
    this.syncOrdersInfo = throttle(this.syncOrdersInfo, 1000)
    this.sscli = sscli
    this.mcli = mcli
    this.ui = ui
  }

  public async searchMyOrders(q: { keyword: string }) {
    return super.searchMyOrders({
      keyword: q.keyword,
      paymentStatus: OrdersUndertaken.paymentStatus,
      shippingStatus: OrdersUndertaken.shippingStatus,
      receiptStatus: OrdersUndertaken.receiptStatus,
    })
  }

  public reset() {
    this.unroutine()
    this.rt = null
    super.reset()
  }

  public routine() {
    this.rt = setInterval(this.syncOrdersInfo
      , OrdersUndertaken.duration)
    this.syncOrdersInfo()
  }

  public unroutine() {
    if (this.rt) {
      clearInterval(this.rt)
    }
  }

  public mutateOrders(nos: MyOrder[]) {
    this.orders = [
      ...this.orders,
      ...nos.filter(ro => !this.orders.filter(o => o.getId() === ro.getId()).length).map(ro => Object.assign(new MyOrderUndertaken(), ro)),
    ]
  }

  @action.bound
  public async loadMore() {
    if (this.ended) {
      return
    }
    const orders = await this.searchMyOrders({ keyword: '' })
    if (orders && orders.length && orders.length === this.pageSize) {
      return
    }
    ra(() => {
      this.ended = true
    })
  }

  @action.bound
  public undertake(orders: MyOrder[]): this {
    if (!this.inited) {
      return this
    }
    const ar: MyOrderUndertaken[] = orders.map(ro => Object.assign(new MyOrderUndertaken(), ro))
    this.orders.unshift(...ar)
    return this
  }

  @action.bound
  private async syncOrdersInfo() {
    if (!this.orders.length) {
      return
    }

    const pros: Array<Promise<SSOrder | null>> = []
    const jwt = await this.accountStore.allocateJWT()
    const md = new grpc.Metadata({ Authorization: `Bearer ${jwt}` })

    try {
      const rems: MyOrderUndertaken[] = []
      // get shansong orders
      for (const order of this.orders) {
        const req = new GetOrderRequest()
        const parcels = order.getFullfillmentOrdersList()[0].getParcelsList()
        let pm: Promise<SSOrder | null> = Promise.resolve(null)
        if (parcels && parcels.length) {
          const parcel = parcels[0]
          const on = parcel.getShansong()
          if (on) {
            req.setName(on)
            pm = curry<SSOrder>(this.sscli.getOrder.bind(this.sscli))(req, md)
          }
        }
        pros.push(pm)
      }
      const res = await Promise.all(pros)
      // sync order info, merge songshan order info addons.
      for (let i = 0, len = res.length; i < len; i++) {
        const order = res[i]
        if (!order) { continue }
        const originOrder = this.orders[i]
        const oStatus = order.getStatus()
        const status = originOrder.getOrderStatus(oStatus)
        if (status === OrderStatusGroup.COMPLETE) {
          // complete -> remove and add to store complete
          rems.push(this.orders[i])
          continue
        }
        // add shansong order to my undertaken order
        let founded = false
        ra(() => {
          originOrder.ssOrders = originOrder.ssOrders.map(o => {
            if (o.order && o.order.getName() === order.getName()) {
              founded = true
              Object.assign(o.order, order)
              return o
            }
            return o
          })
          if (!founded) {
            originOrder.ssOrders.push(new SSOrderWrp(order))
          }
        })
        if (status === OrderStatusGroup.UNDERTAKEN) {
          // undertaken -> sync order trail and redraw map
          const req = new SyncOrderTrailRequest()
          req.setOrder(order.getName())
          try {
            const res = await curry<SyncOrderTrailResponse>(this.sscli.syncOrderTrail.bind(this.sscli))(req, md)
            if (!res) { continue }
            const trail = res.getTrail()
            if (!trail) { continue }
            this.drawMap(originOrder, trail)
          } catch (e) {
            if (e) {
              const msg = '同步订单轨迹错误'
              console.warn(`${msg} ${e.message}`)
              e.message = msg
              this.error = e
            }
          }
        }
      }

      if (rems.length) {
        // check siblings all complete or not, if true remove parent order to complete list
        this.emit(EVENTS_TYPES.ORDER_COMPLETE, rems)
        ra(() => {
          this.removeOrders(rems)
        })
      }
    } catch (e) {
      const msg = '同步闪送单错误'
      console.warn(`${msg} ${e.message}`)
      ra(() => {
        e.message = msg
        this.error = e
      })
    }
  }

  private async drawMap(order: MyOrderUndertaken, trail: Trail): Promise<void> {
    try {
      const mcli = await this.mcli.api()
      const locations = trail.getLocationAndTimesList().map(t => t.getBd09Location())
      const points = locations.filter(l => l).map(l => new mcli.Point(l!.getLongitude(), l!.getLatitude()))
      const last = points[points.length - 1]

      let mapInst = order.mapInst
      if (!mapInst) {
        order.mapInst = new mcli.Map(order.getId())
        order.mapInst.enableScrollWheelZoom()
        mapInst = order.mapInst
        mapInst.centerAndZoom(last, 15)
      } else {
        mapInst.clearOverlays()
        mapInst.setCenter(last)
      }
      const polyline = new mcli.Polyline(points, { strokeColor: 'blue', strokeWeight: 6, strokeOpacity: 0.5 })
      mapInst.addOverlay(polyline)
      const marker = new mcli.Marker(last)
      const icon = new mcli.Icon(require('../public/images/rider.png'), new mcli.Size(40, 40))
      marker.setIcon(icon)
      mapInst.addOverlay(marker)
    } catch (e) {
      console.warn(`绘制地图错误 ${e.message}`)
    }
  }

  private removeOrders(orders: MyOrderUndertaken[]): this {
    this.orders = this.orders.filter(ro => orders.filter(o => o.getId() !== ro.getId()).length)
    return this
  }
}

export class OrdersApply extends Orders {
  public static displayName = OrderStatusGroup.APPLY
  public static orderStatus = SearchMyOrdersQuery.OrderStatus.CONFIRMED
  public static paymentStatus = SearchMyOrdersQuery.PaymentStatus.PAID
  public static shippingStatus = SearchMyOrdersQuery.ShippingStatus.UNSHIPPED
  public static receiptStatus = SearchMyOrdersQuery.ReceiptStatus.UNRECEIVED

  private rt: any = null
  private duration: number = 20 * 1000

  constructor(
    cli: BuyServiceClient,
    accountStore: AccountStore,
    storefrontStore: StorefrontStore,
  ) {
    super(cli, accountStore, storefrontStore, OrdersComplete.displayName, OrdersComplete.paymentStatus)
  }

  public reset() {
    this.unroutine()
    this.rt = null
    super.reset()
  }

  @action.bound
  public async loadMore() {
    if (this.ended) {
      return
    }
    const orders = await this.searchMyOrders()
    if (orders && orders.length && orders.length === this.pageSize) {
      return
    }
    ra(() => {
      this.ended = true
    })
  }

  @action.bound
  public async searchMyOrders(q: Partial<SearchMyOrdersQuery.AsObject> = {}) {
    return super.searchMyOrders({
      keyword: q.keyword,
      orderStatus: OrdersApply.orderStatus,
      paymentStatus: OrdersApply.paymentStatus,
      shippingStatus: OrdersApply.shippingStatus,
      receiptStatus: OrdersApply.receiptStatus,
    })
  }

  @action
  public async routine() {
    let busy = false
    this.rt = setInterval(async () => {
      if (busy) {
        return
      }
      busy = true
      if (!this.orders.length) {
        busy = false
        return
      }
      let c = ~~(this.orders.length / this.pageSize) + 1
      let pageToken = ''
      let sources: MyOrder[] = []
      while (c > 0) {
        try {
          const resp = await this.searchMyOrdersWithNoSideEffect({
            keyword: '',
            orderStatus: OrdersApply.orderStatus,
            paymentStatus: OrdersApply.paymentStatus,
            shippingStatus: OrdersApply.shippingStatus,
            receiptStatus: OrdersApply.receiptStatus,
          }, pageToken)
          pageToken = resp.getNextPageToken()
          const ss = resp.getOrdersList()
          if (ss.length) {
            sources = sources.concat(ss)
          }
          if (ss.length < this.pageSize) {
            break
          }
        } catch (e) {
          console.warn('something wrong in apply orders watching.')
          console.warn(e.message)
          return
        }
        c--
      }
      try {
        const { rems } = this.diff(this.orders, sources)
        if (rems.length) {
          this.removeOrders(rems)
          this.emit(EVENTS_TYPES.ORDER_UNDERTAKEN, rems)
        }
      } catch (e) {
        console.warn('failed to diff and solve nodes in order-apply-list routine', e.message)
      }
      busy = false
    }, this.duration)
  }

  public diff(targets: MyOrder[], sources: MyOrder[]): { rems: MyOrder[] } {
    const adds: MyOrder[] = []
    const rest: MyOrder[] = []
    for (const s of sources) {
      const els = targets.filter(t => t.getId() === s.getId())
      if (!els.length) {
        adds.push(s)
        continue
      }
      rest.push(els[0])
    }
    const rems = targets.filter(t => !rest.filter(r => r.getId() === t.getId()).length)
    return { rems }
  }

  @action
  public removeOrders(rems: MyOrder[]) {
    try {
      let c = rems.length
      while(c--) {
        const r = rems[c]
        for (let i=0, len=this.orders.length; i<len; i++) {
          const order = this.orders[i]
          if (order.getId() === r.getId()) {
            ra(() => {
              this.orders.splice(i, 1)
            })
            break
          }
        }
      }
    } catch (e) {
      console.warn('failed to remove orders in apply order list' + e.message)
    }
  }

  public async unroutine() {
    if (this.rt) {
      clearInterval(this.rt)
    }
  }
}

export class OrdersComplete extends Orders {
  public static displayName = OrderStatusGroup.COMPLETE
  public static orderStatus = SearchMyOrdersQuery.OrderStatus.CONFIRMED
  public static paymentStatus = SearchMyOrdersQuery.PaymentStatus.PAID
  public static shippingStatus = SearchMyOrdersQuery.ShippingStatus.SHIPPED
  public static receiptStatus = SearchMyOrdersQuery.ReceiptStatus.RECEIVED

  constructor(
    cli: BuyServiceClient,
    accountStore: AccountStore,
    storefrontStore: StorefrontStore,
  ) {
    super(cli, accountStore, storefrontStore, OrdersComplete.displayName, OrdersComplete.paymentStatus)
  }

  @action
  public complete(orders: MyOrder[]): this {
    orders = orders
      .filter(ro => !this.orders.filter(o => o.getId() === ro.getId()).length)
      .map(ro => { ro.setStatus(MyOrder.Status.COMPLETED); return ro })
    if (orders.length) {
      this.orders = [...orders, ...this.orders]
    }
    return this
  }

  @action.bound
  public async loadMore() {
    if (this.ended) {
      return
    }
    const orders = await this.searchMyOrders()
    if (orders && orders.length && orders.length === this.pageSize) {
      return
    }
    ra(() => {
      this.ended = true
    })
  }

  @action.bound
  public async searchMyOrders(q: Partial<SearchMyOrdersQuery.AsObject> = {}) {
    return super.searchMyOrders({
      keyword: q.keyword,
      orderStatus: OrdersComplete.orderStatus,
      paymentStatus: OrdersComplete.paymentStatus,
      shippingStatus: OrdersComplete.shippingStatus,
      receiptStatus: OrdersComplete.receiptStatus,
    })
  }
}
