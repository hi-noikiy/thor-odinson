import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { IconChevronRight } from '../../components/icons'
import { IUIStateProps } from '../../store'

@inject('ui')
@observer
export class ShippingPage extends React.Component<IUIStateProps> {
  constructor(props: IUIStateProps) {
    super(props)
    props.ui!.setNavigationBarTitle('配送物流问题')
  }
  public render() {
    return (
      <div className="help-center-page">
        <ul className="list-view">
          <li><Link to="/help/shipping/1">发货时间<IconChevronRight /></Link></li>
          <li><Link to="/help/shipping/2">配送范围<IconChevronRight /></Link></li>
          <li><Link to="/help/shipping/3">商品验货与签收<IconChevronRight /></Link></li>
        </ul>
      </div>
    )
  }
}

interface ISectionProps extends RouteComponentProps<{ section: number }> {

}

export class ShippingSection extends React.Component<ISectionProps> {
  public render() {
    return (
      <div className="help-center-page help-center-content">
        {[
          发货时间,
          配送范围,
          商品验货与签收,
        ][this.props.match.params.section - 1]}
      </div>
    )
  }
}

const 发货时间 = (
  <div>
    <h2>发货时间</h2>
    <ul>
      <li>
        商品会在订单支付成功后即时由配送专员配送。不包含定制、预售或其他与用户事先约定发货时间的产品。
      </li>
      <li>如遇不可抗力因素，配送到达时间可能略有延迟。</li>
      <li>
        由于商品存放仓库位置不同，
        一个订单中的商品可能会被拆分为多个包裹配送。不同的包裹配送时间可能会略有不同。
      </li>
      <li>
        包裹发出后，系统将物流信息更新至顾客的订单信息中，顾客可通过订单中的物流信息追踪包裹。
      </li>
    </ul>
  </div>
)
const 配送范围 = (
  <div>
    <h2>配送范围</h2>
    <p>限北京市，且收货地址在配送仓库20公里以内</p>
  </div>
)
const 商品验货与签收 = (
  <div>
    <h2>商品验货与签收</h2>
    <p>
      为保证服务安全，闪送商城采取密码换货的原则。用户在下单时，闪送商城将提供收货密码给收件人。收件人应在确保见到商品且确认无误后向闪送员提供收件密码。若收件人未见到商品直接向闪送员提供收货密码，收件人应自行承担由此产生的全部风险及损失。
    </p>
    <p>
      若出现闪送员到达配送地点后长时间无法与客户取得联系的情况，闪送员有权将商品送回仓库并上报异常问题，由客服进行取消订单操作，并在扣除本单配送费后，将剩余款项退还至支付账户。
    </p>
  </div>
)
