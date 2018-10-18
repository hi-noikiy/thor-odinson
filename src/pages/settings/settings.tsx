import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { IconChevronRight } from '../../components/icons'
import { ProfileStore, UIState } from '../../store'

interface ISettingsPage extends RouteComponentProps<{}> {
  ui?: UIState
  profileStore?: ProfileStore
}

@inject('ui', 'profileStore')
@observer
export class SettingsPage extends React.Component<ISettingsPage> {
  constructor(props: ISettingsPage) {
    super(props)
    props.ui!.setNavigationBarTitle('设置')
  }

  public render() {
    return (
      <div className="settings-page-container">
        <div className="setting-list">
          <Link className="item" to="/modify-password">
            <span>修改密码</span>
            <span className="icon"><IconChevronRight /></span>
          </Link>
        </div>
        <button className="sign-out" onClick={this.handleSignOut}>退出登录</button>
      </div>
    )
  }

  public handleSignOut = async () => {
    try {
      await this.props.profileStore!.signOut()
      this.props.history.goBack()
    } catch (err) {
      this.props.ui!.toast('退出登录失败')
    }
  }
}
