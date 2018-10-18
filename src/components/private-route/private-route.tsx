import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'

import { AccountStore } from '../../store/auth'

interface IProps extends RouteProps {
  accountStore?: AccountStore
}

/**
 * PrivateRoute 会检测用户是否登录，未登录将跳转至登录页面
 */
@inject('accountStore')
@observer
export class PrivateRoute extends React.Component<IProps> {
  public render() {
    const { accountStore, component, render, children, ...rest } = this.props
    if (accountStore!.loading) {
      return null
    }
    return (
      <Route
        {...rest}
        render={props => {
          if (accountStore!.authenticated) {
            if (component) {
              return React.createElement(component as React.ComponentType<any>, props)
            } else if (render) {
              return render(props)
            } else if (children) {
              return children
            }
          } else {
            return <Redirect to={{ pathname: '/auth/signin', state: { from: props.location } }} />
          }
        }}
      />
    )
  }
}
