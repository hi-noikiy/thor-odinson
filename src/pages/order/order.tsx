import { MyOrder } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { Portal } from 'react-portal'
import { RouteComponentProps } from 'react-router'

import { Alert } from '../../components/alert'
import { Button } from '../../components/button'
import { Checkbox } from '../../components/checkbox'
import { CheckoutLine } from '../../components/checkout-line'
import { IconAlipay, IconContact, IconLocation, IconWechat } from '../../components/icons'
import { Modal } from '../../components/modal'
import { OrderStatusBar } from '../../components/order-status-bar'
import { IStores } from '../../provider'
import { OrderStore, UIState } from '../../store'
import { WxAuth } from '../../store/auth/wx-auth'
import { inWechat, pingpp } from '../../utils'
interface IOrderPageProps extends RouteComponentProps<{id: string}> {
  ui?: UIState
  orderStore?: OrderStore
  wxAuth: WxAuth
}

@inject((stores: IStores, props: IOrderPageProps) => ({
  ui: stores.ui,
  orderStore: stores.resources.getOrderStore(props.match.params.id),
  wxAuth: stores.wxAuth,
}))
@observer
export class OrderPage extends React.Component<IOrderPageProps> {
  public state = {
    payment: inWechat() ? 'wechat': 'ali',
    isOpen: false,
    showAlert: false,
  }

  private loadTimer: any
  private loadingTimer: any

  constructor(props: IOrderPageProps) {
    super(props)
    props.ui!.setNavigationBarTitle('订单详情')
  }

  public async componentDidMount() {
    const { orderStore, ui } = this.props
    ui!.showModal({ description: '加载中...' })
    try {
      await orderStore!.load()
    } catch (err) {
      ui!.hideModal()
      return ui!.toast('订单加载失败，请刷新重试')
    }
    ui!.hideModal()
    if (orderStore!.getStatus() !== 0) {
      return
    }
    this.loadTimer = setInterval(async () => {
      try {
        await orderStore!.load()
      } catch (err) {
        clearInterval(this.loadTimer)
        return
      }
      if (orderStore!.getStatus() !== 0) {
        clearInterval(this.loadTimer)
        if (this.loadingTimer) {
          clearTimeout(this.loadingTimer)
        }
      }
    }, 3000)
  }

  public componentWillUnmount() {
    if (this.loadTimer) {
      clearInterval(this.loadTimer)
    }
  }

  public render() {
    const { orderStore } = this.props
    if (orderStore!.loaded) {
      return this.renderOrder()
    } else if (orderStore!.loading) {
      return null
    } else {
      return <b>页面走丢了</b>
    }
  }

  public renderOrder = () => {
    const { orderStore } = this.props
    const recipient = orderStore!.getRecipient()
    let postalAddress = null
    if (recipient) {
      postalAddress = recipient.getPostalAddress()
    }
    const status = orderStore!.getStatus()
    return (
      <div className="order-page">
        <OrderStatusBar status={status} order={orderStore!.ssOrder}/>
        <div className="recipient list-item">
          <span className="icon-location"><IconLocation /></span>
          {recipient && postalAddress &&
            <div className="info">
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
            </div>
          }
        </div>
        <div className="order-lines">
          {
            orderStore!.lineItems.map((lineItemStore, i: number) => <CheckoutLine small checkoutLineItem={lineItemStore as any} key={i} />)
          }
        </div>
        <div className="fees-info-list">
          <div className="list-item">
            <label>闪送费</label>
            <p>￥{orderStore!.getShippingSubtotal()}</p>
          </div>
          <div className="list-item">
            <label>商品总额</label>
            <p>￥{orderStore!.getProductsSubtotal()}</p>
          </div>
          <div className="list-item">
            <label>商品数量</label>
            <p>{orderStore!.totalNumber} 件</p>
          </div>
          <div className="list-item">
            <label>实付</label>
            <p>￥{orderStore!.getGrandTotal()}</p>
          </div>
          <div className="list-item">
            <label className="remarks-label">订单留言</label>
            <p className="remarks">{orderStore!.getCustomerComments()}</p>
          </div>
        </div>
        <div className="order-detail-infos">
          <p>
            订单号：{orderStore!.getId()}
            <CopyToClipboard text={orderStore!.getId()} onCopy={this.handleCopy}><span className="copy">复制</span></CopyToClipboard>
          </p>
          <p>下单时间：{orderStore!.getCreateTime()}</p>
          {status !== 0 && <p>付款时间：{orderStore!.getPayTime()}</p>}
        </div>
        <Portal>{this.renderBottomButton(status)}</Portal>
        {this.renderPaymentModal()}
        {this.renderAlert()}
      </div>
    )
  }

  private renderBottomButton(status: MyOrder.Status) {
    return (<div className="bottom-action-buttons">
          <div className="contact-btn" onClick={() => _MEIQIA('showPanel')}><IconContact /></div>
          <Button
            className="primary-button"
            text={status === 0 ? '去支付' : '返回首页'}
            onClick={() => {
              if (status === 0) {
                this.handleCheckout()
              } else {
                this.props.history.replace('/')
              }
            }}
          />
        </div>)
  }

  private renderPaymentModal() {
    return (
      <Modal onClose={() => this.setState({ isOpen: false })} isOpen={this.state.isOpen}>
        {
          inWechat() &&
            <div className="wechat modal-menu-item list-item">
              <IconWechat className="icon" />
              <span>微信支付</span>
              <span className="checkbox-wrap">
                <Checkbox
                  checked={this.state.payment === 'wechat'}
                  onChange={() => this.setState({ payment: 'wechat' })}
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
                  checked={this.state.payment === 'ali'}
                  onChange={() => this.setState({ payment: 'ali' })}
                />
              </span>
            </div>
        }
        <div className="btn-wrap">
          <Button text="确定" onClick={this.handlePay} />
        </div>
      </Modal>
    )
  }

  private renderAlert() {
    return (
      <Alert
        isOpen={this.state.showAlert}
        icon={<img src={require('../../public/images/payment-complete.png')}/>}
        title="请确认支付是否已完成"
        description="支付遇到问题，可以选择重新支付"
        cancelText="重新支付"
        confirmText="完成支付"
        onConfirm={this.handlePaymentComplete}
        onCancel={() => this.setState({ showAlert: false })}
      />
    )
  }

  private handleCopy = () => {
    this.props.ui!.toast('复制成功')
  }

  private handleCheckout = async () => {
    if (inWechat()) {
      this.handlePay()
      return
    }
    this.setState({ isOpen: true })
  }

  private handlePay = async () => {
    const { payment } = this.state
    const { orderStore, wxAuth, ui, history } = this.props
    let cred = null
    try {
      ui!.showModal({ description: '正在连接支付网关' })
      if (payment === 'ali') {
        cred = await orderStore!.payWithAlipayWap()
      } else if (payment === 'wechat') {
        if (inWechat()) {
          if (!wxAuth.openId) {
            ui!.hideModal()
            try {
              localStorage.setItem('WXAUTH_REDIRECT_URL', `/orders/${orderStore!.getId()}`)
              await wxAuth!.redirectToAuthorizationUrl(`${window.location.origin}/auth/wxauth/callback`)
            } catch (error) {
              return ui!.toast('请求授权失败')
            }
          } else {
            this.setState({ showAlert: true })
            cred = await orderStore!.payWithWxPub(wxAuth.openId)
          }
        } else {
          await orderStore!.payWithWxWap()
        }
      }
      this.setState({ isOpen: false })
    } catch (err) {
      ui!.hideModal()
      return ui!.toast('发起支付失败，请重试')
    }
    ui!.hideModal()

    if (!cred) {
      return
    }

    try {
      const paid = await pingpp.createPayment(JSON.parse(cred.getOpaque()))
      if (paid) {
        ui!.toast('支付成功')
      } else {
        ui!.toast('已取消，请尽快支付')
      }
      history.replace(`/orders/${orderStore!.getId()}`)
    } catch (error) {
      ui!.toast('支付失败')
    }
  }

  private handlePaymentComplete = () => {
    const { ui } = this.props
    this.setState({
      showAlert: false,
    })
    ui!.showModal({ description: '正在获取支付信息...' })
    this.loadingTimer = setTimeout(() => {
      ui!.hideModal()
      ui!.toast('获取支付信息失败，请手动刷新')
    }, 8000)
  }
}
