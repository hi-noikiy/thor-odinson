import classNames from 'classnames'
import * as React from 'react'

export interface IEmptyStateProps {
  title: React.ReactNode
  action?: JSX.Element
  icon?: JSX.Element
}

export class EmptyState extends React.PureComponent<IEmptyStateProps, {}> {
  public render() {
    const { action, icon, title } = this.props
    return (
      <div className="empty-state">
        {icon}
        <h2 className="empty-state-title">{title}</h2>
        {action && (
          <div className="empty-state-action">
            {action}
          </div
          >)}
      </div>
    )
  }
}
