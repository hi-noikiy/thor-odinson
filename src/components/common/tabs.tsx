import classNames from 'classnames'
import * as React from 'react'

interface ITabsProps {
  defaultActiveKey?: number | string,
  children: Array<React.ReactElement<ITabPaneProps>>
  onTabClick?: (e: React.TouchEvent, i: string | number) => void
  onChange?: (e: React.TouchEvent, i: string | number) => void
}
interface ITabsState {
  activeKey: number | string
}

export class Tabs extends React.Component<ITabsProps, ITabsState> {
  public state = {
    activeKey: 0,
  }

  public componentWillMount() {
    if (this.props.defaultActiveKey) {
      this.setState({ activeKey: this.props.defaultActiveKey! })
    }
  }

  public componentWillUpdate(nextProps: ITabsProps) {
    if (this.props.defaultActiveKey !== nextProps.defaultActiveKey) {
      this.setState({ activeKey: nextProps.defaultActiveKey! })
    }
  }

  public render() {
    const { children } = this.props
    if (!children!.length) {
      return <div></div>
    }
    const { activeKey } = this.state
    const tabPaneContainerStyles = {
      width: children!.length * 100 + '%',
      marginLeft: `-${this.computeActiveTabIndex() * 100}%`,
    }

    return (
      <div className="tabs-container">
        <div className="tabs">
          {children.map((n, i) => (
            <div className="tab-container" key={i} onClick={e => this.onTabClick.apply(this, [e, n.props.tab])}>
              <div className={classNames(n.props.tab === activeKey ? 'tab-active' : 'tab-default')}>
                {n.props.tab}
              </div>
            </div>
          ))}
        </div>
        <ul className="tab-pane-container" style={{ ...tabPaneContainerStyles }}>
          {children}
        </ul>
      </div>
    )
  }

  private computeActiveTabIndex() {
    const { children } = this.props
    return children!.map((n, i) => n.props.tab === this.state.activeKey ? i : 0).filter(i => i)[0] || 0
  }

  private onTabClick(e: React.TouchEvent, tab: number | string) {
    const { onTabClick, onChange } = this.props
    if (onTabClick) {
      onTabClick(e, tab)
    }
    if (onChange && this.state.activeKey !== tab) {
      onChange(e, tab)
    }
    this.setState({ activeKey: tab })
  }
}

interface ITabPaneProps {
  forceRender?: boolean
  key: string | number
  tab: string | React.ReactNode
  children: React.ReactNode
}

export namespace Tabs {
  export class TabPane extends React.Component<ITabPaneProps> {
    public render() {
      return (
        <li className="tab-pane">{this.props.children}</li>
      )
    }
  }
}
