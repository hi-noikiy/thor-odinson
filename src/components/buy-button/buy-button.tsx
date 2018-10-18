import { Product } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { observer } from 'mobx-react'
import * as React from 'react'
import { Portal } from 'react-portal'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { CartLineAdd } from '../../components/cart-line-add'
import { Modal } from '../../components/modal'
import { IconCart, IconContact } from '../icons'
interface IBuyButtonProps extends RouteComponentProps<{}> {
  product?: Product,
  productId?: string,
}

interface IBuyButtonState {
  modalVisible: boolean
  checkout: boolean
}

@observer
export class BuyButton extends React.Component<IBuyButtonProps, IBuyButtonState> {
  constructor(props: IBuyButtonProps) {
    super(props)
    this.state = {
      modalVisible: false,
      checkout: false,
    }
  }

  public render() {
    const { modalVisible } = this.state
    return (
      <Portal>
        <div className="buy-button-container">
          <div className="buy-button">
            <div className="icon-btn-cart">
              <IconContact onClick={() => _MEIQIA('showPanel')} />
            </div>
            <Link to="/cart" className="icon-btn-cart">
              <IconCart />
            </Link>
            <div className="actions-group">
              <div className="add-to-cart" onClick={() => this.setState({ modalVisible: true, checkout: false })}>加入购物车</div>
              <div className="purchase-now" onClick={() => this.setState({ modalVisible: true, checkout: true })}>立即下单</div>
            </div>
          </div>
          <Modal onClose={() => this.setState({ modalVisible: false })} isOpen={modalVisible}>
            <CartLineAdd {...this.props} checkout={this.state.checkout} onClose={() => this.setState({ modalVisible: false })} />
          </Modal>
        </div>
      </Portal>
    )
  }
}
