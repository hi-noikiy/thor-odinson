import classNames from 'classnames'
import * as React from 'react'

import { IconCheckbox, IconCheckboxChecked } from '../icons'

export interface ICheckboxProps {
  label?: string
  checked: boolean
  onChange(checked: boolean): void
}

export class Checkbox extends React.Component<ICheckboxProps> {
  public render() {
    const { label, checked } = this.props
    return (
      <span
        onClick={this.handleChange}
        className={classNames('checkbox', {
          'checkbox-checked': checked,
        })}
      >
        {checked ? <IconCheckboxChecked /> : <IconCheckbox />}
        {label && <span className="label">{label}</span>}
      </span>
    )
  }

  private handleChange = () => {
    const { checked, onChange } = this.props
    onChange(!checked)
  }
}
