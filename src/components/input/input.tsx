import classNames from 'classnames'
import * as React from 'react'

import { IconClear } from '../icons'

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftElement?: JSX.Element
  rightElement?: JSX.Element
  showClear?: boolean
  small?: boolean
}

export class Input extends React.Component<IInputProps> {
  public render() {
    const { leftElement, rightElement, className, showClear, small, ...others } = this.props
    return (
      <div className={classNames('input-container', className, { small })}>
        {leftElement && <div className="input-left-element">{leftElement}</div>}
        <input
          ref="input"
          className="input"
          {...others}
        />
        {showClear && <span className="input-clear" onClick={this.handleClear}><IconClear /></span>}
        {rightElement && <div className="input-right-element">{rightElement}</div>}
      </div>
    )
  }

  public handleClear = () => {
    const input = this.refs.input as HTMLInputElement
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set
    nativeInputValueSetter!.call(input, '')
    const evt = new Event('input', { bubbles: true })
    input.dispatchEvent(evt)
  }
}
