import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router'

import { UIState } from '../../store'
import { IconChevronRight } from '../icons'

interface IProps extends RouteComponentProps<{}> {
  ui?: UIState
}

@inject('ui')
@observer
export class Navbar extends React.Component<IProps> {
  constructor(props: IProps) {
    super(props)
    document.body.classList.add('navbar-visible')
  }

  public componentDidUpdate(nextProps: IProps) {
    const { ui } = nextProps
    if (ui!.navigationBarOptions.title) {
      document.title = ui!.navigationBarOptions.title || '母婴专场'
    }
  }

  public render() {
    const { ui, history } = this.props
    if (!ui!.navbarVisible) {
      return null
    }

    return (
      <div className="navbar">
        {history.length > 1 && (
          <span
            className="navbar-action-back"
            onClick={history.goBack}
          >
            <IconChevronRight />
          </span>
        )}
        <h1 className="navbar-title">{ui!.navigationBarOptions.title}</h1>
      </div>
    )
  }
}

export const NavbarWithRouter = withRouter(Navbar)
