import { inject, observer } from 'mobx-react'
import * as React from 'react'
import Infinite from 'react-infinite'

import { IStores } from '../../provider'
import { IOrders, Orders, OrdersComplete } from '../../store/orders'
import { IconLoading } from '../icons'

import { OrderCompleteListItem } from './order-complete-list-item'
import { IOrderListProps } from './order-list'
import { OrderListEmpty } from './order-list-empty'

@inject((stores: IStores, props: IOrderListProps) => ({
  ui: stores.ui,
  order: stores.ordersStore.types.get(OrdersComplete.displayName),
}))
@observer
export class OrderCompleteList extends React.Component<IOrderListProps> {
  public render() {
    const { order, ui } = this.props

    if (!order) {
      return <div></div>
    }

    if (!order.loading && order.ended && !order.orders.length) {
      return <OrderListEmpty ui={ui} />
    }

    return (
      <div className="order-list-container" style={{ height: ui!.getScreenHeight(0.88, 1) + 'px' }}>
        <Infinite
          preloadAdditionalHeight={Infinite.containerHeightScaleFactor(2)}
          containerHeight={ui!.getScreenHeight(0.88, 1)}
          elementHeight={ui!.calRemToPixel(3.92) + 20}
          infiniteLoadBeginEdgeOffset={100}
          onInfiniteLoad={order.loadMore}
          loadingSpinnerDelegate={
            order.loading && <div className="loading-box"><IconLoading className="order-loading" /></div> || undefined
          }
          isInfiniteLoading={order.loading}
          timeScrollStateLastsForAfterUserScrolls={1000}
        >
          {order.orders.map(o => (
            <OrderCompleteListItem key={o.getId()} store={order as Orders} order={o} />
          ))}
          {this.renderEnded(order)}
        </Infinite>
      </div>
    )
  }

  private renderEnded(order: IOrders) {
    if (order.orders.length && order.ended) {
      return <div className="ended">已经显示全部内容</div>
    }
  }
}
