import { inject, observer } from 'mobx-react'
import * as React from 'react'
import Infinite from 'react-infinite'

import { IStores } from '../../provider'
import { IOrders, MyOrderUndertaken, OrdersUndertaken } from '../../store/orders'
import { IconLoading } from '../icons'

import { IOrderListProps } from './order-list'
import { OrderListEmpty } from './order-list-empty'
import { OrderUndertakenListItem } from './order-undertaken-list-item'

interface IOrderUndertakenListProps {
  order?: OrdersUndertaken
}

@inject((stores: IStores, props: IOrderListProps) => ({
  ui: stores.ui,
  order: stores.ordersStore.types.get(OrdersUndertaken.displayName),
}))
@observer
export class OrderUndertakenList extends React.Component<IOrderListProps & IOrderUndertakenListProps, {}> {
  public render() {
    const { ui, order } = this.props

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
          elementHeight={order.infiElsHeight}
          infiniteLoadBeginEdgeOffset={100}
          onInfiniteLoad={order.loadMore}
          loadingSpinnerDelegate={
            order.loading && <div className="loading-box"><IconLoading className="order-loading" /></div> || undefined
          }
          isInfiniteLoading={order.loading}
          timeScrollStateLastsForAfterUserScrolls={1000}
          displayBottomUpwards={false}
        >
          {order.orders.map(o => (
            <OrderUndertakenListItem key={o.getId()} store={order} order={o as MyOrderUndertaken} />
          ))}
          {this.renderEnded(order)}
        </Infinite>
      </div>
    )
  }

  private renderEnded(order: IOrders & OrdersUndertaken) {
    if (order.orders.length && order.ended) {
      return <div className="ended">已经显示全部内容</div>
    }
  }
}
