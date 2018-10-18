import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router'

import { WxAuth } from '../../store/auth/wx-auth'
import { inWechat } from '../../utils'

interface IProps extends RouteProps {
  wxAuth?: WxAuth
}

/**
 * WxAuthRoute 会检测当前是否拥有 openid，如果没有将会跳转至 /auth/wxauth/authorize
 * 并发起授权请求。只有在微信浏览器内才会生效
 */
@inject('wxAuth')
@observer
export class WxAuthRoute extends React.Component<IProps> {
  public render() {
    const { wxAuth, component, render, children, ...rest } = this.props
    return (
      <Route
        {...rest}
        render={props => {
          if (!inWechat()) {
            return this.renderer(props)
          }
          if (wxAuth!.openId) {
            return this.renderer(props)
          } else {
            return <Redirect to={{ pathname: '/auth/wxauth/authorize', state: { from: props.location } }} />
          }
        }}
      />
    )
  }

  private renderer(props: RouteComponentProps<any>) {
    const { component, render, children, ...rest } = this.props
    if (component) {
      return React.createElement(component as React.ComponentType<any>, props)
    } else if (render) {
      return render(props)
    } else if (children) {
      return children
    }
  }
}
