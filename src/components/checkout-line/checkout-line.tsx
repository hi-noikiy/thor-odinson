import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import * as React from 'react'

import { Checkbox } from '../../components/checkbox'
import { IconCaretDown } from '../../components/icons'
import { Modal } from '../../components/modal'
import { Tag } from '../../components/tag'
import { IStores, UIState } from '../../provider'
import { CheckoutLineItem } from '../../store'

interface ICheckoutLineProps {
  checkoutLineItem: CheckoutLineItem,
  small?: boolean
  ui?: UIState
}

@inject((stores: IStores) => ({
  ui: stores.ui,
}))

@observer
export class CheckoutLine extends React.Component<ICheckoutLineProps, {isOpen: boolean}> {
  public state = {
    isOpen: false,
  }

  public render() {
    const { checkoutLineItem, small } = this.props
    const { isOpen } = this.state
    return (
      <div className={classNames('checkout-line-container', { small })}>
        <div className="img">
          <img src={checkoutLineItem.getImageUrl()} width="111" height="111" />
        </div>
        <div className="info">
          <div className="title">{checkoutLineItem.getTitle()}</div>
          <div className="attrs">{checkoutLineItem.attributes && checkoutLineItem.attributes.join(' / ')}</div>
          <div className="price-quantity">
            <span>x{checkoutLineItem.getQuantity()}</span>
            <span>￥{checkoutLineItem.getPrice()}</span>
          </div>
          {/* <div className="storehouse">
            <button
              className="btn"
              onClick={() => this.setState({ isOpen: true })}
            >
              待选配送仓<span className="icon"><IconCaretDown /></span>
            </button>
          </div> */}
        </div>
        {/* <Modal onClose={() => this.setState({ isOpen: false })} isOpen={isOpen}>
          <div className="modal-menu-item list-item">
            <p>望京配送点</p>
            <div className="storehouse-distance">
              <span>距离20km</span>
              <p className="checkout-line-distance-tags">
                <Tag type="danger" text="库存紧张" />
              </p>
            </div>
            <span className="checkbox-wrap">
              <Checkbox checked={true} onChange={this.handleCheckChange} />
            </span>
          </div>
          <div className="checkout-line-btn-text-wrap">
            <p className="checkout-line-select-btn-text">
              <span>闪送费：</span>
              <span>￥9998</span>
            </p>
            <button
              className="checkout-line-select-btn"
              onClick={() => this.setState({ isOpen: false })}
            >
              确认
            </button>
          </div>
        </Modal> */}
      </div>
    )
  }

  // public handleCheckChange() {
  //   this.props.ui!.showModal()
  //   // TODO(victorwshuo): calc shipping fee

  //   this.props.ui!.hideModal()
  // }
}
