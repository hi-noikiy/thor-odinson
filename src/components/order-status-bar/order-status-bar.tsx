import { MyOrder } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { Order } from '@xrc-inc/buy-sdk/ecnova/api/shansong/v1/shansong_proto/shansong_pb'
import classNames from 'classnames'
import * as React from 'react'

import { IconApply, IconCheckboxChecked, IconWallet } from '../icons'

interface IOrderStatusBarProps {
  status: MyOrder.Status
  order?: Order
}

export class OrderStatusBar extends React.Component<IOrderStatusBarProps> {
  public states = ['待抢单', '待取件', '已就位', '派送中', '已完成']

  public render() {
    return (
      <div className="order-status-bar-container">
        {this.renderBarByStatus()}
      </div>
    )
  }

  public renderBarByStatus = () => {
    const { status, order } = this.props
    if (status === 0) {
      return (<p className="text"><IconWallet className="order-status-icon"/> 待付款</p>)
    }

    if (status === MyOrder.Status.PAID) {
      return (<p className="text"><IconApply className="order-status-icon"/> 待派发</p>)
    }

    let ssStatus: number = 0
    if (order) {
      switch (order.getStatus()) {
        case Order.Status.WAITING_FOR_SERVICE: ssStatus = 0
                                               break
        case Order.Status.WAITING_FOR_PICKUP: ssStatus = 1
                                              break
        case Order.Status.READY_TO_PICKUP: ssStatus = 2
                                           break
        case Order.Status.DELIVERING: ssStatus = 3
                                      break
        case Order.Status.DONE:
        case Order.Status.CANCELLED:
          ssStatus = 4
      }
    }

    return (
      <div className="bar">
        {
          this.states.map((st, i)=> {
            return (
              <div key={i} className="dot-line">
                {
                  i === ssStatus
                    ? (<div className={classNames('dot', 'current')}>
                        <IconCheckboxChecked className="icon"/>
                        <span>{st}</span>
                      </div>)
                    : (<div className={classNames('dot', { complete: i < ssStatus })}>
                        <span>{st}</span>
                      </div>)
                }
                {
                  i !== this.states.length - 1 &&
                    <div
                      className={
                        classNames('line', {
                          complete: i < ssStatus,
                          short: i === ssStatus || i + 1 === ssStatus,
                        })
                      }
                    >
                    </div>
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}
