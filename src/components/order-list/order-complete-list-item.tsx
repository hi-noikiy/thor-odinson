import { MyOrder } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { Orders } from '../../store/orders'
import { IconOrder } from '../icons'

export interface IOrderCompleteListItemProps {
  order: MyOrder,
  store?: Orders,
}

@observer
export class OrderCompleteListItem extends React.Component<IOrderCompleteListItemProps, {}> {
  public render() {
    const { order, store } = this.props

    return (
      <div className="order-list-item">
        <div className="header">
          <div className="desc">
            <div className="desc-top">
              <span className="title">{store!.getStatusDisplayName(order.getStatus())}</span>
              <span className="quatity">( {order.getLineItemsList().length}件商品 )</span>
            </div>
            <div className="desc-bottom">
              <span>订单号: {order.getId()}</span>
            </div>
          </div>
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
      </div>
    )
  }
}
