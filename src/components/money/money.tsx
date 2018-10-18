import Type from '@xrc-inc/buy-sdk/google/type/money_pb'
import classNames from 'classnames'
import * as React from 'react'

import { parseMoneyToFloat } from '../../utils'

interface IMoney {
  className?: string,
  money?: Type.Money
}
export class Money extends React.Component<IMoney> {
  public render() {
    const { className, money } = this.props
    return (
      <div className={classNames(className, 'money-container')}>
        {
          `￥${parseMoneyToFloat(money)}`
        }
      </div>
    )
  }
}
