import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Link, RouteComponentProps } from 'react-router-dom'

import { ProfileStore, UIState } from '../../store'

import { IconApply, IconBox, IconChevronRight, IconClock, IconWallet } from '../../components/icons'

interface IProps extends RouteComponentProps<{}> {
  ui: UIState
  profileStore?: ProfileStore
}

@inject('profileStore', 'ui')
@observer
export class UserCenterPage extends React.Component<IProps, { isOpen: boolean }> {
  public state: any = {
    isOpen: false,
  }

  constructor(props: IProps) {
    super(props)
    props.ui!.setNavigationBarTitle('个人中心')
  }

  public async componentDidMount() {
    const { profileStore } = this.props
    if (!profileStore!.loaded) {
      profileStore!.load()
    }
  }

  public render() {
    const { profileStore } = this.props
    return (
      <div className="user-center-container">
        <div className="user-profile">
          <img className="avatar" src={require('../../public/images/user-avatar.svg')} alt="" />
          {
            profileStore!.loaded ? <p className="name">{profileStore!.getNickName()}</p> :
              !profileStore!.loading && <Link className="name" to="/auth/signin">登录 / 注册</Link>
          }
        </div>
        <div className="order-type-nav">
          <Link to="/orders?status=0" className="order-type">
            <IconWallet />
            <span>待付款</span>
          </Link>
          <Link to="/orders?status=1" className="order-type">
            <IconApply className="order-type-apply" />
            <span>待派发</span>
          </Link>
          <Link to="/orders?status=2" className="order-type">
            <IconClock />
            <span>进行中</span>
          </Link>
          <Link to="/orders?status=3" className="order-type">
            <IconBox />
            <span>已完成</span>
          </Link>
        </div>
        <div className="list">
          <Link className="item" to="/recipients">
            <span>收货地址</span>
            <span className="icon">
              <IconChevronRight />
            </span>
          </Link>
          <div className="item" onClick={() => _MEIQIA('showPanel')}>
            <span>客服中心</span>
            <span className="icon">
              <IconChevronRight />
            </span>
          </div>
          <Link className="item" to="/help">
            <span>常见问题</span>
            <span className="icon">
              <IconChevronRight />
            </span>
          </Link>
          <Link className="item" to="/settings">
            <span>设置</span>
            <span className="icon">
              <IconChevronRight />
            </span>
          </Link>
        </div>
      </div>
    )
  }
}
