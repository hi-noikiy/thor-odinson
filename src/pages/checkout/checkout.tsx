import { PingppPaymentCredential } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Portal } from 'react-portal'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { Button } from '../../components/button'
import { Checkbox } from '../../components/checkbox'
import { CheckoutLine } from '../../components/checkout-line'
import { IconAlipay, IconChevronRight, IconClear, IconLoading, IconLocation, IconMark, IconWechat } from '../../components/icons'
import { Modal } from '../../components/modal'
import { IStores } from '../../provider'
import { CheckoutStore, OrderStore, ProfileStore, ShoppingCartStore, UIState } from '../../store'
import { WxAuth } from '../../store/auth/wx-auth'
import { inWechat, pingpp } from '../../utils'

interface ICheckoutPage extends RouteComponentProps<{}> {
  ui?: UIState
  shoppingCartStore?: ShoppingCartStore
  profileStore?: ProfileStore
  checkoutStore?: CheckoutStore
  wxAuth?: WxAuth
}

interface ICheckoutState {
  payment: string
  remarksFocus: boolean
  isOpen: boolean
}

@inject((stores: IStores) => ({
  shoppingCartStore: stores.shoppingCartStore,
  profileStore: stores.profileStore,
  ui: stores.ui,
  checkoutStore: stores.checkoutStore,
  wxAuth: stores.wxAuth,
}))
@observer
export class CheckoutPage extends React.Component<ICheckoutPage, ICheckoutState> {
  public state = {
    payment: inWechat() ? 'wechat': 'ali',
    remarksFocus: false,
    isOpen: false,
  }

  private storagePoints = [
    {
      center: [116.495198, 40.004848],
      distance: 20000,
    },
    {
      center: [116.379869, 40.094356],
      distance: 20000,
    },
    {
      center: [116.486759, 39.917584],
      distance: 20000,
    },
  ]

  constructor(props: ICheckoutPage) {
    super(props)
    document.body.classList.add('has-checkout-and-pay')
  }

  public async componentDidMount() {
    const { ui, profileStore, shoppingCartStore, history } = this.props
    ui!.setNavigationBarTitle('确认订单')
    ui!.showModal({ description: '加载中...' })
    try {
      if (!profileStore!.loaded) {
        await profileStore!.load()
      }
      if (!shoppingCartStore!.checkout.loaded) {
        await shoppingCartStore!.load()
      }
    } catch (err) {
      ui!.hideModal()
      ui!.toast('加载失败，请刷新重试')
      return
    }
    const hasRecipient = shoppingCartStore!.checkout.getRecipient()
    const recipient = profileStore!.getDefaultRecipient()
    if (recipient && (!hasRecipient || (hasRecipient && !hasRecipient.getFullName()))) {
      shoppingCartStore!.checkout.setRecipient(recipient)
    }
    if (this.refs.remarks) {
      (this.refs.remarks as any).innerHTML = shoppingCartStore!.checkout.getCustomerComments()
    }
    ui!.hideModal()

    if (!shoppingCartStore!.checkout.getLineItemsList().length) {
      return history.replace('/orders?status=0')
    }
  }

  public render() {
    const { remarksFocus } = this.state
    const { shoppingCartStore } = this.props
    const { checkout } = shoppingCartStore!
    const recipient = checkout.getRecipient()
    let postalAddress = null
    if (recipient) {
      postalAddress = recipient.getPostalAddress()
    }
    if (shoppingCartStore!.checkout.loaded) {
      return (
        <div className="checkout-container">
          <div className="tip-area">
            <h3>9:00 - 21:00 下单，平均 1 小时送达</h3>
            <p>其他时间段下单，请在订单留言中写明具体配送时间</p>
          </div>
          <div className="divider"></div>
          <Link className="recipient list-item" to={postalAddress ? '/recipients?from=checkout' : '/create-recipient?from=checkout'}>
            <span className="icon-location"><IconLocation /></span>
            {recipient && postalAddress
              ? (<div className="info">
                <p>
                  {recipient.getFullName()}&nbsp;
                    {recipient.getPhoneNumber()}
                </p>
                <p>
                  {postalAddress.getLocality()}&nbsp;
                    {postalAddress.getSublocality()}&nbsp;
                    {postalAddress.getAddressLinesList()[0]}
                  {postalAddress.getAddressLinesList()[1]}
                </p>
              </div>)
              : (<div className="empty">添加收货地址</div>)
            }
            <span className="icon-chevron"><IconChevronRight /></span>
          </Link>
          <div className="checkout-lines">
            {
              checkout.lineItems.map((lineItemStore, i: number) => <CheckoutLine checkoutLineItem={lineItemStore} key={i} />)
            }
          </div>
          <div className="fees">
            <div className="list-item shipping">
              <label>
                <span>闪送费</span>
                <span className="icon">
                  <IconMark />
                </span>
              </label>
              <p>
                {
                  checkout!.updating
                    ? (<span className="loading-icon"><IconLoading /></span>)
                    : (`￥${checkout.getShippingSubtotal()}`)
                }
              </p>
            </div>
            <div className="list-item">
              <label>商品总额</label><p>￥{checkout.getProductsSubtotal()}</p>
            </div>
            <div className="list-item">
              <label>商品数量</label><p>{checkout.totalNumber} 件</p>
            </div>
          </div>
          <div className={classNames('remarks', 'list-item')}>
            <label>订单留言</label>
            <p className="input"
              onFocus={() => this.setState({ remarksFocus: true })}
              onBlur={() => this.setState({ remarksFocus: false })}
              onInput={this.handleRemarksInput}
              contentEditable
              ref="remarks"
            ></p>
            {
              !remarksFocus && !checkout.getCustomerComments() &&
              <span
                className="remarks-placeholder"
                onClick={() => (this.refs.remarks as any).focus()}
              >
                订单留言
                </span>
            }
            {
              checkout.getCustomerComments() && <IconClear className="clear-icon" onClick={this.handleClearRemarks} />
            }
          </div>
          {this.renderBottomBar()}
          {this.renderPaymentModal()}
        </div >
      )
    } else if (shoppingCartStore!.checkout.error) {
      return <i>{shoppingCartStore!.checkout.error}</i>
    } else {
      return null
    }
  }

  public handleCheckout = async () => {
    const { shoppingCartStore, ui } = this.props
    const checkout = shoppingCartStore!.checkout
    const latLng = checkout.getRecipient()!.getLatLng()!
    let chkable = false
    ui!.showModal({ description: '正在计算配送距离...' })
    try {
      for (const p of this.storagePoints) {
        const distance = await checkout.calcDistance(latLng.getLongitude(), latLng.getLatitude(), p.center[0], p.center[1])
        if (distance < p.distance) {
          chkable = true
          break
        }
      }
    } catch (err) {
      ui!.toast('配送距离计算出错，请刷新重试')
      return
    } finally {
      ui!.hideModal()
    }
    if (!chkable) {
      ui!.toast('超出配送范围，请重新选择地址')
      return
    }
    if (inWechat()) {
      this.handlePayment()
      return
    }
    this.setState({ isOpen: true })
  }

  public handlePayment = async () => {
    const { ui, shoppingCartStore } = this.props
    const { payment } = this.state
    if (!shoppingCartStore!.checkout!.getIsValid()) {
      ui!.toast('下单失败：库存不足')
      return
    }
    ui!.showModal({ description: '正在下单...' })
    let ord: OrderStore
    try {
      ord = await shoppingCartStore!.checkout!.placeOrder()
      this.setState({ isOpen: false })
    } catch (error) {
      ui!.hideModal()
      ui!.toast(`下单失败: ${error.message}`)
      return
    }
    if (payment === 'wechat') {
      await this.payWithWechat(ord)
    } else if (payment === 'ali') {
      await this.payWithAlipay(ord)
    }
    ui!.hideModal()
  }

  public handleCheckChange = (payment: string) => {
    this.setState({ payment })
  }

  public handleRemarksInput = () => {
    this.props.shoppingCartStore!.checkout!.setCustomerComments((this.refs.remarks as any).innerHTML)
  }

  public handleClearRemarks = () => {
    (this.refs.remarks as any).innerHTML = ''
    this.props.shoppingCartStore!.checkout!.setCustomerComments('')
  }

  private renderBottomBar() {
    const { shoppingCartStore } = this.props
    const { checkout } = shoppingCartStore!
    const recipient = checkout.getRecipient()
    let postalAddress = null
    if (recipient) {
      postalAddress = recipient.getPostalAddress()
    }
    return (
      <Portal>
        <div className="checkout-and-pay">
          <p className="text">
            <span>应付</span>
            <span className="price">￥{checkout.getGrandTotal()}</span>
          </p>
          <button
            className={classNames('btn', { disabled: !postalAddress || checkout!.updating })}
            disabled={!postalAddress || checkout!.updating}
            onClick={this.handleCheckout}
          >
            支付
          </button>
        </div>
      </Portal>
    )
  }

  private renderPaymentModal() {
    const { payment, isOpen } = this.state
    return (
      <Modal onClose={() => this.setState({ isOpen: false })} isOpen={isOpen}>
        {
          inWechat() &&
            <div className="wechat modal-menu-item list-item">
              <IconWechat className="icon" />
              <span>微信支付</span>
              <span className="checkbox-wrap">
                <Checkbox
                  checked={payment === 'wechat'}
                  onChange={this.handleCheckChange.bind(this, 'wechat')}
                />
              </span>
            </div>
        }
        {
          !inWechat() &&
            <div className="ali modal-menu-item list-item">
              <IconAlipay className="icon" />
              <span>支付宝支付</span>
              <span className="checkbox-wrap">
                <Checkbox
                  checked={payment === 'ali'}
                  onChange={this.handleCheckChange.bind(this, 'ali')}
                />
              </span>
            </div>
        }
        <div className="btn-wrap">
          <Button text="确定" onClick={this.handlePayment} />
        </div>
      </Modal>
    )
  }

  private async payWithWechat(order: OrderStore) {
    const { wxAuth, ui, history } = this.props
    if (inWechat()) {
      const openId = wxAuth!.openId
      // Checkout 页面通过 WxAuthRoute 路由组件渲染，此处必然会有 openid
      if (!openId) {
        ui!.toast('未获取微信授权')
        return
      }
      let cred: PingppPaymentCredential
      try {
        cred = await order.payWithWxPub(openId)
      } catch (error) {
        ui!.toast(`payWithWxPub error: ${error.message}`)
        return
      }
      try {
        const paid = await pingpp.createPayment(JSON.parse(cred.getOpaque()))
        if (paid) {
          ui!.toast('支付成功')
          history.replace('/orders?status=1')
        } else {
          ui!.toast('已取消，请尽快支付')
          history.replace(`/orders/${order.getId()}`)
        }
      } catch (error) {
        ui!.toast(`支付失败: ${error.message}`)
        history.replace(`/orders/${order.getId()}`)
      }
    } else {
      // TODO(j): 使用微信 H5 支付
    }
  }

  private async payWithAlipay(order: OrderStore) {
    const cred = await order.payWithAlipayWap()
    // 支付宝 WAP 支付会跳转到支付宝的支付页面支付
    await pingpp.createPayment(JSON.parse(cred.getOpaque()))
  }
}
