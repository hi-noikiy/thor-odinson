import { MyOrder } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { PingppPaymentCredential } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { inject } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { Checkbox } from '../../components/checkbox'
import { IconAlipay, IconWechat } from '../../components/icons'
import { Modal } from '../../components/modal'
import { IStores } from '../../provider'
import { UIState } from '../../store'
import { CheckoutLineItem, CheckoutStore, OrderStore } from '../../store'
import { WxAuth } from '../../store/auth/wx-auth'
import { inWechat, parseMoneyToFloat, pingpp } from '../../utils'
import { Alert } from '../alert'
import { Button } from '../button'
import { CheckoutLine } from '../checkout-line'

export interface IOrderUnpaidListItemProps extends RouteComponentProps<{}>{
  ui?: UIState
  order: MyOrder
  orderStore?: OrderStore
  checkoutStore?: CheckoutStore
  wxAuth?: WxAuth
}

@inject((stores: IStores, props: IOrderUnpaidListItemProps) => ({
  ui: stores.ui,
  checkoutStore: stores.checkoutStore,
  orderStore: stores.resources.getOrderStore(props.order.getId()),
  wxAuth: stores.wxAuth,
}))
export class OrderUnpaidListItem extends React.Component<IOrderUnpaidListItemProps, {}> {
  public state = {
    payment: inWechat() ? 'wechat': 'ali',
    isOpen: false,
    showAlert: false,
  }
  private loadingTimer: any
  public async componentDidMount() {
    const { orderStore } = this.props
    await orderStore!.load()
  }
  public totalNumber = () => {
    return this.props.order.getLineItemsList().reduce((t, li) => {
      t = t + li.getQuantity()
      return t
    }, 0)
  }
  public render() {
    const { order, history } = this.props
    const orderId = order.getId()
    return (
      <div className="order-list-item">
        <div className="up-paid-header">
          订单号: {orderId}
        </div>
        {order.getLineItemsList().map((li, i) => {
          return (
            <CheckoutLine
              checkoutLineItem={new CheckoutLineItem(li as any)}
              key={i}
            />
          )
        })}
       <div className="fees-info-list">
          <div className="list-item">
            <label>闪送费</label>
            <p>￥{parseMoneyToFloat(order!.getShippingSubtotal())}</p>
          </div>
          <div className="list-item-right">
            共{this.totalNumber()} 件 / 应付 <span className="price">￥{parseMoneyToFloat(order!.getGrandTotal())}</span>
          </div>
          <div className="list-item-right">
            <span><Button text="查看详情" className="small-button info-btn" onClick={()=>history.push(`/orders/${orderId}`)}></Button></span>
            <span>
              <Button
              text="去支付"
              onClick={this.handleCheckout}
              className="small-button"></Button></span>
          </div>
        </div>
        {this.renderPaymentModal()}
        {this.renderAlert()}
        </div>
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
          if (!wxAuth!.openId) {
            ui!.hideModal()
            try {
              localStorage.setItem('WXAUTH_REDIRECT_URL', `/orders/${orderStore!.getId()}`)
              await wxAuth!.redirectToAuthorizationUrl(`${window.location.origin}/auth/wxauth/callback`)
            } catch (error) {
              return ui!.toast('请求授权失败')
            }
          } else {
            this.setState({ showAlert: true })
            cred = await orderStore!.payWithWxPub(wxAuth!.openId!)
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
    const { orderStore, ui, history } = this.props
    this.setState({
      showAlert: false,
    })
    ui!.showModal({ description: '正在获取支付信息...' })
    this.loadingTimer = setTimeout(() => {
      ui!.hideModal()
      history.replace(`/orders/${orderStore!.getId()}`)
    }, 8000)
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
}
