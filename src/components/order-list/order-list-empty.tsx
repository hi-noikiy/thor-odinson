import * as React from 'react'

import { UIState } from '../../store/ui'

interface IOrderListEmptyProps {
  ui?: UIState
}

export const OrderListEmpty = (props: Partial<IOrderListEmptyProps>) => {
  const { ui } = props
  return (
    <div className="order-list-noitem" style={{ height: ui!.getScreenHeight(0.88, 1) + 'px' }}>
      <img src={require('../../public/images/empty-order-list.png')} />
      <p>还没有相关订单</p>
    </div>
  )
}
