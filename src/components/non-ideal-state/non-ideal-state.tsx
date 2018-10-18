import classNames from 'classnames'
import * as React from 'react'

export interface INonIdealStateProps {
    action?: JSX.Element
    className?: string
    children?: React.ReactNode
    icon?: JSX.Element
    title?: React.ReactNode
    description?: React.ReactChild
}

export class NonIdealState extends React.PureComponent<INonIdealStateProps, {}> {
  public render() {
    const { action, children, className, icon, description, title } = this.props
    return (
      <div className={classNames('non-ideal-state', className)}>
        {icon && <span>{icon}</span> }
        {title && <h2>{title}</h2>}
        {description}
        {action}
        {children}
      </div>
    )
  }
}
