import { inject, observer } from 'mobx-react'
import * as React from 'react'

import { ICartItemLine, UIState } from '../../store'
import { Checkbox } from '../checkbox'
import { QuantityInput } from '../quantity-input'

interface ICartLineProps {
  lineItem: ICartItemLine
  ui?: UIState
}

@inject('ui')
@observer
export class CartLine extends React.Component<ICartLineProps> {
  public render() {
    const { lineItem } = this.props
    return (
      <div className="cart-line">
        <Checkbox
          checked={lineItem.isSelected}
          onChange={this.handleCheckChange}
        />
        <div className="img">
          <img src={lineItem.getImageUrl()} width="111" height="111" />
        </div>
        <div className="info">
          <div className="title">{lineItem.getTitle()}</div>
          <div className="attrs">{lineItem.attributes.join(' / ')}</div>
          <div className="price">￥{lineItem.getPrice()}</div>
          <div className="flex-1" />
          <div className="quantity">
            <QuantityInput
              small
              max={999}
              quantity={lineItem.getQuantity()}
              onChange={async qty => {
                this.props.ui!.showModal()
                try {
                  await lineItem.adjustQuantity(qty)
                } catch (error) {
                  console.warn(error)
                } finally {
                  this.props.ui!.hideModal()
                }
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  private handleCheckChange = async (checked: boolean) => {
    this.props.ui!.showModal()
    if (checked) {
      await this.props.lineItem.selectForCheckout()
    } else {
      await this.props.lineItem.unselect()
    }
    this.props.ui!.hideModal()
  }
}
