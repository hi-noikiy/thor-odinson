import Type from '@xrc-inc/buy-sdk/google/type/money_pb'
import classNames from 'classnames'
import * as React from 'react'

import { parseMoneyToFloat } from '../../utils'

interface IMoneyRangeProps {
  className?: string,
  range: [Type.Money | number | undefined, (Type.Money | number)?],
  division: string,
  flag: string,
}

export class MoneyRange extends React.Component<IMoneyRangeProps> {
  public static defaultProps: Partial<IMoneyRangeProps> = {
    division: '-',
    flag: '¥',
  }

  public render() {
    const { className, range, division, flag } = this.props
    let [low, high] = range
    if (!low) {
      low = 0
    }
    if (!high) {
      high = low
    }
    if (low === high) {
      return <span className={classNames(className)}>{`${flag} ${this.parseMoney(low)}`}</span>
    }
    return (
      <span className={classNames(className)}>{range.map(r => `${flag} ${this.parseMoney(r!)}`).join(` ${division} `)}</span>
    )
  }

  public parseMoney(m: Type.Money | number) {
    if (m instanceof Type.Money) {
      return parseMoneyToFloat(m)
    }
    return m
  }
}
