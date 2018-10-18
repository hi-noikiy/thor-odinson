import classNames from 'classnames'
import * as React from 'react'

import { IconClear } from '../icons'

export interface IFloatingTextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string,
  isErr?: boolean,
}

interface IFloatingTextFieldState {
  lableSBig: boolean
  iconCloseIsShow: boolean
}

export class FloatingTextField extends React.Component<IFloatingTextFieldProps, IFloatingTextFieldState> {
  private input = React.createRef<HTMLInputElement>()

  constructor(props: any) {
    super(props)
    this.state = { lableSBig: true, iconCloseIsShow: false }
  }
  public render() {
    const { label, isErr, onChange, ...others } = this.props
    const { lableSBig, iconCloseIsShow } = this.state
    const lableClass = classNames({
      'lable-big': lableSBig,
      'lable-small': !lableSBig || this.props.value,
      'err': isErr,
    })
    const iconClass = classNames({
      'icon-close-show': iconCloseIsShow,
      'icon-close-hidden': !iconCloseIsShow,
    })
    return (
      <div className="floating-text-field">
        <label className={lableClass} onClick={() => this.input.current!.focus()}>
          {label}
        </label>
        <div className="fli-input-wrapper">
          <input
            ref={this.input}
            onFocus={this.handleOnFocus}
            onBlur={this.handleOnBlur}
            onChange={this.handleOnChange}
            {...others}
          />
          <span onClick={this.handleClear} className={ iconClass }>
            <IconClear color="#9DA6BC"/>
          </span>
        </div>
      </div>
    )
  }

  public handleClear = () => {
    const input = this.input.current as HTMLInputElement
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set
    nativeInputValueSetter!.call(input, '')
    const evt = new Event('input', { bubbles: true })
    input.dispatchEvent(evt)
    this.setState({ iconCloseIsShow: false })
    input.focus()
  }

  public handleOnBlur = (e: any) => {
    setTimeout(() => {
      const input = this.input.current as HTMLInputElement
      if (!this.props.value && input !== document.activeElement) {
        this.setState({ lableSBig: true, iconCloseIsShow: false })
        return
      }
      this.setState({ iconCloseIsShow: false })
    }, 1)
  }

  public handleOnChange = (e: any) => {
    const { onChange } = this.props
    const { iconCloseIsShow } = this.state
    if (onChange) {
      onChange(e)
    }
    if (e.target.value && !iconCloseIsShow) {
      return this.setState({ iconCloseIsShow: true })
    }
    if (!e.target.value && iconCloseIsShow) {
      return this.setState({ iconCloseIsShow: false })
    }
  }
  public handleOnFocus = (e: any) => {
    this.setState({ lableSBig: false })
    if (e.target.value) {
      this.setState({ iconCloseIsShow: true })
    }
  }
}
