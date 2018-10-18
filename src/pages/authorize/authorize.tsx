import { inject } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { GithubOAuth2Store, UIState } from '../../store'
import { WxAuth } from '../../store/auth/wx-auth'

interface IMatchParams {
  provider: string
}

interface IProps extends RouteComponentProps<IMatchParams> {
  ui?: UIState
  wxAuth?: WxAuth
  githubAuth?: GithubOAuth2Store
}

/**
 * AuthorizePage 会自动跳转到 OAuth2 服务的授权页面
 */
@inject('wxAuth', 'githubAuth', 'ui')
export class AuthorizePage extends React.Component<IProps> {
  public async componentDidMount() {
    const { ui, githubAuth, wxAuth, match: { params }, location } = this.props

    let from
    if (location.state && location.state.from) {
      from = location.state.from.pathname
    }
    ui!.showModal({ description: '正在请求授权...' })
    if (params.provider === 'github') {
      if (from) {
        localStorage.setItem('LOGIN_REDIRECT_URL', from)
      }
      await githubAuth!.redirectToAuthorizationUrl(`${window.location.origin}/auth/github/callback`)
    } else if (params.provider === 'wxauth') {
      if (from) {
        localStorage.setItem('WXAUTH_REDIRECT_URL', from)
      }
      await wxAuth!.redirectToAuthorizationUrl(`${window.location.origin}/auth/wxauth/callback`)
    }
  }

  public render() {
    return null
  }
}
