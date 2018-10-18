import { MyOrder } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { Orders } from '../../store/orders'
import { IconOrder } from '../icons'
import { MoneyRange } from '../money'

export interface IOrderApplyListItemProps {
  order: MyOrder,
  store?: Orders,
}

@observer
export class OrderApplyListItem extends React.Component<IOrderApplyListItemProps, {}> {
  public render() {
    const { order } = this.props

    return (
      <div className="order-list-item">
        <div className="up-paid-header">
          订单号: {order.getId()}
        </div>
        {order.getLineItemsList().map((li, i) => {
          return (
            <div key={i} className="apply-order-item-li">
              <div className="apply-order-img-area">
                <img src={'https:' + li.getImageUrl()} />
              </div>
              <div className="apply-order-desc-area">
                <b className="apply-order-title">{li.getTitle()}</b>
                <p className="apply-order-desc">{this.getAttributes(li)}</p>
                <span className="apply-order-qty">
                  x{li.getQuantity()}
                </span>
                <MoneyRange className="apply-order-qty" range={[li.getPrice()]}/>
              </div>
            </div>
          )
        })}
        <div className="fees-info-list">
          <div className="list-item">
            <label>闪送费</label>
            <MoneyRange range={[order!.getShippingSubtotal()]} />
          </div>
          <div className="list-item-right">
            共 {this.getTotalNum()} 件 / 实付 <span className="price"><MoneyRange range={[order.getGrandTotal()]} /></span>
          </div>
          <div className="list-item-right">
            <span>
              <Link to={`/orders/${order.getId()}`}>
                <button className="small-button primary-btn">查看详情</button>
              </Link>
            </span>
          </div>
        </div>
      </div>
    )
  }

  private getAttributes(li: MyOrder.LineItem): string {
    const attrs = []
    const color = li.getVariant()!.getColor()
    if (color) {
      attrs.push(color.getDisplayName())
    }
    const size = li.getVariant()!.getSize()
    if (size) {
      attrs.push(size)
    }
    return attrs.join('/')
  }

  private getTotalNum() {
    return this.props.order.getLineItemsList().reduce((a, c) => a + c.getQuantity(), 0)
  }
}
