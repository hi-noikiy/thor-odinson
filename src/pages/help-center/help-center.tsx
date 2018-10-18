import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Link } from 'react-router-dom'

import { IconChevronRight } from '../../components/icons'
import { IUIStateProps } from '../../store'

@inject('ui')
@observer
export class HelpCenterPage extends React.Component<IUIStateProps> {
  constructor(props: IUIStateProps) {
    super(props)
    props.ui!.setNavigationBarTitle('帮助中心')
  }
  public render() {
    return (
      <div className="help-center-page">
        <ul className="list-view">
          <li><Link to="/help/qa">常见问题<IconChevronRight /></Link></li>
          <li><Link to="/help/after-sale">售后问题<IconChevronRight /></Link></li>
          <li><Link to="/help/invoice">发票问题<IconChevronRight /></Link></li>
          <li><Link to="/help/shipping">配送物流问题<IconChevronRight /></Link></li>
          <li><Link to="/help/service-policy">服务政策<IconChevronRight /></Link></li>
        </ul>
      </div>
    )
  }
}
