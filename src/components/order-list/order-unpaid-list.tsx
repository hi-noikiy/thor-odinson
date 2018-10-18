import { inject, observer } from 'mobx-react'
import * as React from 'react'

import { IStores } from '../../provider'
import { OrdersUnpaid } from '../../store/orders'
import { IconLoading } from '../icons'

import { IOrderListProps } from './order-list'
import { OrderListEmpty } from './order-list-empty'
import { OrderUnpaidListItem } from './order-unpaid-list-item'

@inject((stores: IStores, props: IOrderListProps) => ({
  ui: stores.ui,
  order: stores.ordersStore.types.get(OrdersUnpaid.displayName),
}))
@observer
export class OrderUnpaidList extends React.Component<IOrderListProps, {}> {
  public render() {
    const { order, ui, ...rest } = this.props
    if (order!.loading) {
      return <div className="loading-indicator-overlay"><IconLoading className="loading-indicator-overlay-white"/></div>
    }

    if (!order!.orders.length) {
      return <OrderListEmpty ui={ui} />
    }

    return (
      <div className="order-list-container" style={{ height: ui!.getScreenHeight(0.88, 1) }}>
        {order!.orders.map(o => {
          return <OrderUnpaidListItem key={o.getId()} order={o} {...rest as any}/>
        })}
      </div>
    )
  }
}
