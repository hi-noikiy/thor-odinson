import React from 'react'

import { throttle } from '../../utils'

export interface IThrottleProps<T> {
  onChange: ((...a: T[]) => any) | undefined
}

export interface IInnerProps {
  duration?: number
  beforeChange?: (...args: any[]) => any
}

type IThrottleUnionProps<T> = IThrottleProps<T> & IInnerProps

export function throttleHOC <P extends Partial<IThrottleProps<K>>, K = any>(Component: React.ComponentClass<P>): React.ComponentClass<P & IThrottleUnionProps<K>> {
  class ThrottleComponent extends React.Component<P & IThrottleUnionProps<K>> {
    private handle: (...args: K[]) => void

    constructor(props: P & IThrottleProps<K> & IInnerProps) {
      super(props)
      const duration = props.duration || 1000
      const tr = throttle<K>((...args: K[]) => props.onChange!.apply(this, args), duration)
      this.handle = (...args) => {
        if (props.beforeChange) {
          props.beforeChange.call(this, ...args)
        }
        tr.call(this, ...args)
      }
    }

    public render() {
      const { beforeChange, onChange, duration, ...rest } = this.props as IThrottleUnionProps<K>
      // @todo
      const Comp = Component as any
      return <Comp {...rest} onChange={this.handle.bind(this)} />
    }
  }
  return ThrottleComponent
}
