
import classnames from 'classnames'
import * as React from 'react'

interface ITagProps {
  text: React.ReactNode
  type: 'primary' | 'danger' | 'warning'
  className?: string
}

export class Tag extends React.Component<ITagProps> {
  public render() {
    const { text, type, className } = this.props
    return (
      <span className={classnames('tag', type, className)}>{text}</span>
    )
  }
}
