import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { IStores } from '../../provider'
import { IOrders, IOrdersStore, MyOrderUndertaken } from '../../store/orders'
import { IconLoading, IconOrder } from '../icons'

export interface IOrderUntertakenListItemProps {
  store: IOrders
  order: MyOrderUndertaken,
  ordersStore?: IOrdersStore
}

@inject((stores: IStores, props: IOrderUntertakenListItemProps) => ({
  ordersStore: stores.ordersStore,
}))
@observer
export class OrderUndertakenListItem extends React.Component<IOrderUntertakenListItemProps, {}> {
  public render() {
    const { order } = this.props

    return (
      <div className="order-list-item">
        <div className="header">
          <div className="desc">
            <div className="desc-top">
              {order.ssStatus && <span className="title">{order.ssStatus}</span>}
              {!order.ssStatus && <IconLoading className="loading" />}
              <span className="quatity">( {order.getLineItemsList().length}件商品 )</span>
            </div>
            <div className="desc-bottom">
              <span>订单号: {order.getId()}</span>
            </div>
          </div>
          {order.courierPhoneNumber && <div className="oper"><a href={'tel:' + order.courierPhoneNumber}>联系闪送员</a></div>}
        </div>
        <div className="content">
          <div className="images">
            {order.getLineItemsList().slice(0, 3).map((li, i) => (
              <img src={'https:' + li.getImageUrl()} key={i} />
            ))}
          </div>
          <Link className="oper-container" to={`/orders/${order.getId()}`}>
            <div className="oper">
              <div className="icon">
                <IconOrder />
              </div>
              <div className="desc">订单详情</div>
            </div>
          </Link>
        </div>
        {order.showMap && (
          <div id={order.getId()} className="order-map">
            <IconLoading className="order-loading" />
          </div>
        )}
      </div>
    )
  }
}
