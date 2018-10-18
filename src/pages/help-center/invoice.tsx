import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { IconChevronRight } from '../../components/icons'
import { IUIStateProps } from '../../store'

@inject('ui')
@observer
export class InvoicePage extends React.Component<IUIStateProps> {
  constructor(props: IUIStateProps) {
    super(props)
    props.ui!.setNavigationBarTitle('发票问题')
  }
  public render() {
    return (
      <div className="help-center-page">
        <ul className="list-view">
          <li><Link to="/help/invoice/1">发票什么时候能收到？<IconChevronRight /></Link></li>
          <li><Link to="/help/invoice/2">电子发票开具时间和下载地址？<IconChevronRight /></Link></li>
          <li><Link to="/help/invoice/3">什么是电子发票？<IconChevronRight /></Link></li>
          <li><Link to="/help/invoice/4">为什么我的订单不支持开发票？<IconChevronRight /></Link></li>
          <li><Link to="/help/invoice/5">选择开具单位抬头发票时为什么需要填写纳税人识别号？<IconChevronRight /></Link></li>
          <li><Link to="/help/invoice/6">发票的金额包含运费或活动金额吗？<IconChevronRight /></Link></li>
          <li><Link to="/help/invoice/7">发票的类型以及内容有哪些？<IconChevronRight /></Link></li>
        </ul>
      </div>
    )
  }
}

interface ISectionProps extends RouteComponentProps<{ section: number }> {

}

export class InvoiceSection extends React.Component<ISectionProps> {
  public render() {
    return (
      <div className="help-center-page help-center-content">
        {[
          发票什么时候能收到,
          电子发票开具时间和下载地址,
          什么是电子发票,
          为什么我的订单不支持开发票,
          选择开具单位抬头发票时为什么需要填写纳税人识别号,
          发票的金额包含运费或活动金额吗,
          发票的类型以及内容有哪些,
        ][this.props.match.params.section - 1]}
      </div>
    )
  }
}
const 发票什么时候能收到 = (
  <div>
    <h2>发票什么时候能收到？</h2>
    <p>
      目前可以开具电子增值税普通发票(简称“电子发票”)，如您需要开具增值税普通发票，请在购买后联系客服协助处理。
    </p>
    <p />
    <p>
      根据国家规定，发票内容以实际购买产品详情为准，不再允许使用大类名称代替。
    </p>
  </div>
)
const 电子发票开具时间和下载地址 = (
  <div>
    <h2>电子发票开具时间和下载地址？</h2>
    <p>
      发票总金额等于您实际支付的消费金额，不包括未实际支出的折扣的金额和使用礼品卡支付的金额。
    </p>
  </div>
)
const 什么是电子发票 = (
  <div>
    <h2>什么是电子发票？</h2>
    <p>
      根据国家税务总局公告2017年第16号第一条规定：购买方为企业的，索取发票时，应向销售方提供纳税人识别号或统一社会信用代码；销售方为其开具发票时，应在“购买方纳税人识别号”栏填写购买
      方的纳税人识别号或统一社会信用代码。不符合规定的发票，不得作为税收凭证。
    </p>
    <p>您可以通过以下两种方式获取纳税人识别号：</p>
    <ul>
      <li>①联系公司财务咨询开票信息；</li>
      <li>②登录全国组织代码管理中心查询：www.nacao.org.cn/</li>
    </ul>
    <p>
      如果开具境外单位（包括港澳台）发票，没有纳税人识别号或统一社会信用代码，可以选择发票抬头为个人，再填写境外单位名称。
    </p>
  </div>
)
const 为什么我的订单不支持开发票 = (
  <div>
    <h2>为什么我的订单不支持开发票？</h2>
    <p>
      当您的订单金额为0元或者该订单完全使用礼品卡、优惠券、虚拟货币账户支付的时候；或特殊渠道下单时不支持开发票。
    </p>
    <p>
      礼品卡在出售时已向礼品卡购买方开具发票，因此用于消费时不再支持重复开票。虚拟货币所产生的支付，商城将为虚拟货币的提供方结算开票，故在购买时也无法重复开票。
    </p>
  </div>
)
const 选择开具单位抬头发票时为什么需要填写纳税人识别号 = (
  <div>
    <h2>选择开具单位抬头发票时为什么需要填写纳税人识别号？</h2>
    <p>
      电子发票是指在购销商品、提供或者接受服务以及从事其他经营活动中，开具、收取的以电子方式存储的收付款凭证。本商城开具的电子发票均为真实有效的合法发票，与传统纸质发票具有同等法律效力。电子发票可以用于财务报销、保修和维权。pp
    </p>
    <p>
      根据国家税务总局公告2015年84号《关于推行通过增值税电子发票系统开具的增值税电子普通发票有关问题的公告》第三条：增值税电子普通发票的开票方和受票方需要纸质发票的，可以自行打印增值税电子普通发票的版式文件，其法律效力、基本用途、基本使用规定等与税务机关监制的增值税普通发票相同。pp
    </p>
  </div>
)
const 发票的金额包含运费或活动金额吗 = (
  <div>
    <h2>发票的金额包含运费或活动金额吗？</h2>
    <p>
      电子发票将会在订单下所有包裹确认收货后开具。开具后，会给您发送短信，您可通过短信链接下载发票。如遇其他问题，请联系客服。
    </p>
  </div>
)
const 发票的类型以及内容有哪些 = (
  <div>
    <h2>发票的类型以及内容有哪些？</h2>
    <p>正常情况下，电子发票可在收货后通过短信链接下载。</p>
  </div>
)
