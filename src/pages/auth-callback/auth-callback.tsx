import { inject, observer } from 'mobx-react'
import queryString from 'query-string'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { IStores } from '../../provider'
import { AccountStore, GithubOAuth2Store, ProfileStore, ShoppingCartStore, UIState } from '../../store'
import { WxAuth } from '../../store/auth/wx-auth'

interface IMatchParams {
  provider: string
}

interface ILoginPageProps extends RouteComponentProps<IMatchParams> {
  accountStore?: AccountStore
  oauth2Authenticated?: boolean
  githubAuth?: GithubOAuth2Store
  profileStore?: ProfileStore
  shoppingCartStore?: ShoppingCartStore
  wxAuth?: WxAuth
  ui?: UIState
}

@inject((stores: IStores) => ({
  wxAuth: stores.wxAuth,
  ui: stores.ui,
}))
@observer
export class AuthCallbackPage extends React.Component<ILoginPageProps> {
  public async componentDidMount() {
    const { wxAuth, ui, match, history, location } = this.props
    const { params: { provider } } = match
    const { code, state } = queryString.parse(location.search)
    ui!.showModal({ description: '正在获取授权信息' })

    if (provider === 'wxauth') {
      try {
        const token = await wxAuth!.handleCallback(code, state)
        if (!token) {
          throw new Error('请求微信授权时发生错误')
        }
      } catch (error) {
        ui!.toast(`授权失败：${error.message}`)
      } finally {
        ui!.hideModal()
      }
      const from = localStorage.getItem('WXAUTH_REDIRECT_URL') || '/cart'
      localStorage.removeItem('WXAUTH_REDIRECT_URL')
      history.replace(from)
    } else {
      ui!.toast(`非法的授权操作: ${provider}`)
      history.replace('/')
    }
    ui!.hideModal()
  }

  public render() {
    return null
  }
}
