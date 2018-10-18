import classNames from 'classnames'
import * as React from 'react'

interface IButtonProps extends React.InputHTMLAttributes<HTMLButtonElement> {
  text: React.ReactNode
  disabled?: boolean
  /** 是否 100% 宽，默认为 true */
  full?: boolean
  /** 是否有阴影，默认为 true */
  shadow?: boolean
}

export class Button extends React.Component<IButtonProps> {
  public render() {
    const { text, disabled, className, full = true, shadow = true, ...others } = this.props
    const classes = classNames('primary-button',
      {
        'w-full': full,
        'shadow-lg': shadow,
      },
      className,
    )
    return (
      <button disabled={disabled} className={classes} {...others}>
        {text}
      </button>
    )
  }
}
