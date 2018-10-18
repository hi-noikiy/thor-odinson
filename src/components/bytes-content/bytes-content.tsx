import * as React from 'react'

import { decodeBase64, EncodeStringToBytes } from '../bytes-input/util'

interface IBytesContentProps {
  bytesValue: string
  onChange(bytesValue: string): void
  children(props: IBytesContentRendererProps): React.ReactNode
}

interface IBytesContentRendererProps {
  value: string
  setValue(value: string): void
}

export class BytesContent extends React.Component<IBytesContentProps> {
  public render() {
    return this.props.children({
      value: format(this.props.bytesValue),
      setValue: this.setValue,
    })
  }

  private setValue = (stringValue: string) => {
    this.props.onChange(parse(stringValue))
  }
}

function parse(s: string): string {
  return EncodeStringToBytes(s)
}

function format(s: string): string {
  return String.fromCharCode.apply(null, decodeBase64(s))
}
