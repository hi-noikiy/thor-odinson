import { BasicAuthRequest } from '@xrc-inc/buy-sdk/ecnova/api/account/v1/account_proto/account_pb'
import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { IStores } from '../../provider'
import { ProfileStore, ShoppingCartStore, UIState } from '../../store'
import { AccountStore, AuthConnStore, GithubOAuth2Store, SMSAuthStore } from '../../store/auth'

import { BasicAuthorize } from './basic'
import { ResetPassword } from './reset-password'
import { SMSAuthorize } from './sms'
import { SetPassword } from './sms/set-password'

type AuthActions = 'signin' | 'signup' | 'forget-password' | 'set-password' | 'reset-password'
interface IMatchParams {
  action: AuthActions
}

const titles = {
  'signin': '登录',
  'signup': '注册',
  'forget-password': '找回密码',
  'set-password': '设置密码',
  'reset-password': '重置密码',
}

export interface IProps extends RouteComponentProps<IMatchParams> {
  /** SMSAuthStore，用于请求 SMSAuthConnect 系统和验证短信验证码 */
  smsAuthStore?: SMSAuthStore
  /** AccountStore，用于请求 Account 系统进行 Federal 认证并获取 AccessToken */
  authConnStore?: AuthConnStore
  accountStore?: AccountStore
  profileStore?: ProfileStore
  githubAuth?: GithubOAuth2Store
  ui?: UIState
  shoppingCartStore?: ShoppingCartStore
}

interface IState {
  action: AuthActions
  authConnectIdentityToken?: Token
  authConnAccessToken?: string
  accountIdentityToken?: string
  accountAccessToken?: string
}

@inject((stories: IStores) => stories)
@observer
export class AuthApp extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props)
    const { ui, match: { params: { action } } } = props
    const accountIdentityToken = localStorage.getItem('ACCOUNT_IDENTITY_TOKEN') || ''
    this.state = {
      action,
      accountIdentityToken,
    }
    ui!.setNavigationBarTitle(titles[action])
  }

  public componentDidUpdate(prevProps: IProps) {
    this.props.ui!.setNavigationBarTitle(titles[this.props.match.params.action])
  }

  public componentWillReceiveProps(props: IProps) {
    this.setState({ action: props.match.params.action })
  }

  public componentWillUnmount() {
    localStorage.removeItem('ACCOUNT_IDENTITY_TOKEN')
  }

  public render() {
    const { action } = this.state
    let children: JSX.Element | null = null
    switch (action) {
      case 'signin':
        children = <BasicAuthorize onAuthorize={this.handleBasicAuth} />
        break
      case 'signup':
        children = (
          <SMSAuthorize
            onSendCode={this.handleSendCode}
            onAuthorize={this.handleSignup}
            showServiceAgreementLink={action === 'signup'}
          />
        )
        break
      case 'forget-password':
        children = (
          <SMSAuthorize
            onSendCode={this.handleSendCode}
            onAuthorize={this.handleForgetPassword}
            showServiceAgreementLink={false}
            phoneNumberPlaceholder={'请输入注册时使用的手机号'}
          />
        )
        break
      case 'reset-password':
        children = <ResetPassword onSubmit={this.handleResetPassword} />
        break
      case 'set-password':
        children = <SetPassword onSubmit={this.handleSetPassword} />
        break
    }

    return (
      <div className="auth-page">
        <div className="flex justify-center">
          <img className="login-logo self-center" src={require('../../public/images/login-logo.svg')} />
        </div>
        <div className="form-container">
          {children}
        </div>
      </div>
    )
  }

  private handleSendCode = async (phoneNumber: string) => {
    const { ui, smsAuthStore } = this.props
    ui!.showModal()
    try {
      await smsAuthStore!.authorize(phoneNumber)
    } catch (error) {
      console.warn('sms authorize failed: ', error.message)
      ui!.toast('发送验证码时遇到了问题，请稍候重试')
      return
    } finally {
      ui!.hideModal()
    }
    ui!.toast(`验证码已发送至 ${phoneNumber}`)
  }

  private handleSignup = async (phoneNumber: string, code: string) => {
    const { ui, smsAuthStore, accountStore, authConnStore } = this.props
    ui!.showModal()
    try {
      const smsIdentityToken = await smsAuthStore!.codeAuthenticate(`+86${phoneNumber}`, code)
      const authConnAccessToken = await authConnStore!.getAccessToken(smsIdentityToken.getOpaque())
      const accountIdentityToken = await accountStore!.federalAuth(authConnAccessToken.getOpaque())
      const accountAccessToken = await accountStore!.getAccessToken(accountIdentityToken.getOpaque())
      await accountStore!.setUsername(phoneNumber, accountAccessToken.getOpaque())
      await accountStore!.setUserInfo({ displayName: phoneNumber, avatarUrl: '' }, accountAccessToken.getOpaque())
      // 将 accountIdentityToken 存入 localStorage，成功设置密码之后使用此 token 初始化 accountStore
      localStorage.setItem('ACCOUNT_IDENTITY_TOKEN', accountIdentityToken.getOpaque())
      this.setState({
        accountAccessToken: accountAccessToken.getOpaque(),
        accountIdentityToken: accountIdentityToken.getOpaque(),
        authConnAccessToken: authConnAccessToken.getOpaque(),
        action: 'set-password',
      })
    } catch (error) {
      console.warn(error)
      ui!.toast('请输入正确验证码')
    } finally {
      ui!.hideModal()
    }
  }

  private handleForgetPassword = async (phoneNumber: string, code: string) => {
    const { ui, smsAuthStore, accountStore, authConnStore } = this.props
    ui!.showModal()
    try {
      const smsIdentityToken = await smsAuthStore!.codeAuthenticate(`+86${phoneNumber}`, code)
      const authConnAccessToken = await authConnStore!.getAccessToken(smsIdentityToken.getOpaque())
      const accountIdentityToken = await accountStore!.federalAuth(authConnAccessToken.getOpaque())
      const accountAccessToken = await accountStore!.getAccessToken(accountIdentityToken.getOpaque())
      await accountStore!.setUsername(phoneNumber, accountAccessToken.getOpaque())
      await accountStore!.setUserInfo({ displayName: phoneNumber, avatarUrl: '' }, accountAccessToken.getOpaque())
      // 将 accountIdentityToken 存入 localStorage，成功设置密码之后使用此 token 初始化 accountStore
      localStorage.setItem('ACCOUNT_IDENTITY_TOKEN', accountIdentityToken.getOpaque())
      this.setState({
        accountAccessToken: accountAccessToken.getOpaque(),
        accountIdentityToken: accountIdentityToken.getOpaque(),
        authConnAccessToken: authConnAccessToken.getOpaque(),
        action: 'reset-password',
      })
    } catch (error) {
      console.warn(error)
      ui!.toast('请输入正确验证码')
    } finally {
      ui!.hideModal()
    }
  }

  private handleSetPassword = async (password: string) => {
    const { history, ui, profileStore, accountStore, shoppingCartStore, smsAuthStore } = this.props
    const { authConnAccessToken, accountIdentityToken, accountAccessToken } = this.state
    if (!authConnAccessToken || !accountIdentityToken || !accountAccessToken) {
      throw new Error('未认证')
    }
    ui!.showModal()
    try {
      await accountStore!.setPassword(password, accountAccessToken)
    } catch (error) {
      console.warn('set password failed: ', error.message)
      ui!.toast('设置密码失败，请重试')
      ui!.hideModal()
      return
    }
    accountStore!.setIdentityToken(accountIdentityToken)
    try {
      await profileStore!.join()
    } catch (error) {
      console.warn('join storefront failed: ', error.message)
    }
    try {
      await shoppingCartStore!.syncLocalShoppingCart()
    } catch (error) {
      console.warn('merge shopping cart items failed: ', error.message)
    }
    ui!.toast('注册成功，已自动登录')
    const from = localStorage.getItem('LOGIN_REDIRECT_URL') || '/cart'
    localStorage.removeItem('LOGIN_REDIRECT_URL')
    history.replace(from)
  }

  private handleResetPassword = async (password: string) => {
    const { history, ui, profileStore, accountStore, shoppingCartStore } = this.props
    const { authConnAccessToken, accountIdentityToken, accountAccessToken } = this.state
    if (!authConnAccessToken || !accountIdentityToken || !accountAccessToken) {
      throw new Error('未认证')
    }
    ui!.showModal()
    try {
      await accountStore!.setPassword(password, accountAccessToken)
    } catch (error) {
      console.warn('set password failed: ', error.message)
      ui!.toast('重置密码失败，请重试')
      ui!.hideModal()
      return
    }
    accountStore!.setIdentityToken(accountIdentityToken)
    try {
      await profileStore!.join()
    } catch (error) {
      console.warn('join storefront failed: ', error.message)
    }
    try {
      await shoppingCartStore!.syncLocalShoppingCart()
    } catch (error) {
      console.warn('merge shopping cart items failed: ', error.message)
    }
    ui!.toast('重置密码成功，已自动登录')
    const from = localStorage.getItem('LOGIN_REDIRECT_URL') || '/'
    localStorage.removeItem('LOGIN_REDIRECT_URL')
    history.replace(from)
  }

  private handleBasicAuth = async (values: BasicAuthRequest.AsObject) => {
    const { history, ui, accountStore, profileStore, shoppingCartStore } = this.props
    ui!.showModal({ description: '正在登录' })
    let accountIdentityToken: Token
    try {
      accountIdentityToken = await accountStore!.basicAuth(values)
    } catch (error) {
      ui!.hideModal()
      ui!.toast('手机号或密码错误')
      return
    }
    accountStore!.setIdentityToken(accountIdentityToken.getOpaque())
    await profileStore!.join()
    try {
      await shoppingCartStore!.syncLocalShoppingCart()
    } catch (error) {
      console.warn('merge shopping cart items failed: ', error.message)
    }
    ui!.toast('登录成功')
    const from = localStorage.getItem('LOGIN_REDIRECT_URL') || '/cart'
    localStorage.removeItem('LOGIN_REDIRECT_URL')
    history.replace(from)
  }
}
