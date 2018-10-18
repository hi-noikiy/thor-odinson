import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { Tabs } from '../../components/common'
import { OrderApplyList, OrderCompleteList, OrderUndertakenList, OrderUnpaidList } from '../../components/order-list'
import { UIState } from '../../store'
import { IOrdersStore, OrdersApply, OrdersComplete, OrdersUndertaken, OrdersUnpaid } from '../../store/orders'

const TabPane = Tabs.TabPane

interface IOrdersPageProps extends RouteComponentProps<{}> {
  ui?: UIState
  ordersStore?: IOrdersStore
}

@inject('ordersStore', 'ui')
@observer
export class OrdersPage extends React.Component<IOrdersPageProps> {
  constructor(props: IOrdersPageProps) {
    super(props)
    props.ui!.setNavigationBarTitle('我的订单')
  }

  public componentWillMount() {
    const { ordersStore } = this.props
    ordersStore!.onTabChange(this.getCurrentStatusTab())
  }

  public componentWillUnmount() {
    this.props.ordersStore!.reset()
  }

  public render() {
    const { ordersStore } = this.props
    return (
      <Tabs
        defaultActiveKey={this.getCurrentStatusTab()}
        onChange={(_, tab) => ordersStore!.onTabChange(tab as string)}
      >
        {ordersStore!.getTypesMap().map(([tab, order], i) => (
          <TabPane key={i} tab={tab}>
          { (order instanceof OrdersUnpaid) && <OrderUnpaidList {...this.props}/> }
          { (order instanceof OrdersApply) && <OrderApplyList /> }
          { (order instanceof OrdersUndertaken) && <OrderUndertakenList /> }
          { (order instanceof OrdersComplete) && <OrderCompleteList /> }
          </TabPane>
        )) as any}
      </Tabs>
    )
  }

  private getCurrentStatusTab = () => {
    const { ordersStore, location: { search } }  = this.props
    let c: any = null
    if (!search) {
      c = ordersStore!.getTypesMap()[0][0]
    }
    const statusArr = search.match(/status=\d/)
    if (!statusArr) {
      c = ordersStore!.getTypesMap()[0][0]
    } else {
      const s = statusArr[0].replace('status=', '')
      c = ordersStore!.getTypesMap()[s as any][0]
    }
    return c
  }
}
