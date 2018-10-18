import classNames from 'classnames'
import * as React from 'react'

import { IconMinus, IconPlus } from '../icons'

interface IQuantityInputProps {
  /**
   * 默认为 1
   */
  quantity?: number
  /**
   * 默认为 Infinity
   */
  max?: number
  /**
   * 默认为 1
   */
  min?: number
  /**
   * 组件大小
   */
  small?: boolean
  /**
   * 如果 onChange 的返回值为 Promise，当前组件将会 disable 直到 promise 被 resolve 或 reject
   * @param quantity 新的数量
   */
  onChange(quantity: number): Promise<any> | any
}

interface IState {
  disabled: boolean
  quantity?: string
}
export class QuantityInput extends React.Component<
  IQuantityInputProps,
  IState
> {
  constructor(props: IQuantityInputProps) {
    super(props)
    this.state = {
      disabled: false,
      quantity: props.quantity ? props.quantity.toString() : '1',
    }
  }

  public componentWillReceiveProps(nextProps: IQuantityInputProps) {
    if (nextProps.quantity !== undefined) {
      this.setState({
        quantity: nextProps.quantity ? nextProps.quantity.toString() : '1',
      })
    }
  }

  public render() {
    const { min = 1, max = Infinity, small } = this.props
    const { disabled, quantity } = this.state
    const quantityAsNum = parseInt((quantity as string) || '0')
    return (
      <div className={classNames('quantity-input', { 'size-small': small })}>
        <button
          onClick={() => this.handleChange(quantityAsNum - 1)}
          disabled={disabled || quantityAsNum === 1}
        >
          <IconMinus />
        </button>
        <input
          value={quantity}
          type="number"
          min={min}
          max={max}
          onChange={evt => this.setState({ quantity: evt.currentTarget.value })}
          onBlur={this.handleQuantityChange}
        />
        <button
          onClick={() => this.handleChange(quantityAsNum + 1)}
          disabled={disabled || quantityAsNum >= max}
        >
          <IconPlus />
        </button>
      </div>
    )
  }

  private handleQuantityChange = () => {
    const { min = 1, max = Infinity } = this.props
    let qty = parseInt(this.state.quantity || '1')
    if (Number.isNaN(qty)) {
      qty = 1
    } else if (qty < min) {
      qty = min
    } else if (qty > max) {
      qty = max
    }
    this.setState({ quantity: qty.toString() }, () => {
      this.props.onChange(Math.abs(qty))
    })
  }

  private handleChange = async (quantity: number) => {
    const res = this.props.onChange(quantity)
    if (typeof res !== 'undefined' && typeof res.then === 'function') {
      this.setState({ disabled: true })
      await res.then
      this.setState({ disabled: false })
    }
  }
}
