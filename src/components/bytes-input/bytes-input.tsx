import * as React from 'react'

import { Input } from '../../components/input'
import { BytesContent } from '../bytes-content'

interface IBytesInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
  onBytesChange(s: string): void
}

export class BytesInput extends React.PureComponent<IBytesInputProps> {
  public render() {
    const { value = '', onBytesChange, children, ...other } = this.props
    return (
      <BytesContent bytesValue={value} onChange={onBytesChange}>
        {({ value, setValue }) => (
          <Input
            {...other}
            value={value}
            onChange={evt => setValue(evt.currentTarget.value)}
          />
        )}
      </BytesContent>
    )
  }
}
