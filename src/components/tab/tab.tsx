import * as React from 'react'
import { Link, NavLink } from 'react-router-dom'

import { IconCart, IconShop, IconUser } from '../icons'

interface ITabProps { }

export class Tab extends React.Component<ITabProps> {
  constructor(props: ITabProps) {
    super(props)
    document.body.classList.add('has-tabbar')
  }

  public componentWillUnmount() {
    document.body.classList.remove('has-tabbar')
  }

  public render() {
    return (
      <React.Fragment>
        <div className="tab-content">
          {this.props.children}
        </div>
        <div className="tab-bar">
          <NavLink to="/" activeClassName="active" exact replace>
            <IconShop />
          </NavLink>
          <NavLink to="/cart" activeClassName="active" exact replace>
            <IconCart />
          </NavLink>
          <NavLink to="/user-center" activeClassName="active" exact replace>
            <IconUser />
          </NavLink>
        </div>
      </React.Fragment>
    )
  }
}
