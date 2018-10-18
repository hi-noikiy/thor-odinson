import * as React from 'react'

import { AutoPlaySwipeableViews } from './swiper_impl'

interface ISwiperProps {
  indicatorDots?: boolean
  indicatorColor?: string
  indicatorActiveColor: string
  indicatorRadius: number
  indicatorMargin: number
  autoplay?: boolean
  current: number
  interval: number
  // TODO(lq): 优化 children 的类型定义
  children: React.ReactChild[]
}
interface ISwiperState {
  current: number
}

export class Swiper extends React.Component<ISwiperProps, ISwiperState> {
  public static defaultProps: Partial<ISwiperProps> = {
    indicatorDots: true,
    indicatorActiveColor: '#50555F',
    indicatorRadius: 5,
    indicatorMargin: 7,
    interval: 3000,
    current: 0,
  }

  constructor(props: ISwiperProps) {
    super(props)
    this.state = {
      current: props.current ? props.current : 0,
    }
  }

  public componentWillUpdate(prevProps: ISwiperProps) {
    if (prevProps.current !== this.props.current) {
      this.setState({ current: this.props.current })
    }
  }

  public render() {
    const {
      children,
      interval,
    } = this.props

    return (
      <div className="swiper-container">
        <AutoPlaySwipeableViews interval={interval} autoplay={true}  onChangeIndex={(i: number) => this.setState({ current: i })}>
          {children}
        </AutoPlaySwipeableViews>
        { this.renderIndicatorDots() }
      </div>
    )
  }

  private renderIndicatorDots() {
    const {
      children,
      indicatorDots,
      indicatorActiveColor,
      indicatorRadius,
      indicatorColor,
      indicatorMargin,
    } = this.props

    if (!indicatorDots) {
      return
    }

    const { current } = this.state
    // TODO(lq): 使用 React.Children.map 方法操作 children
    const indicatorCount = children && children.length || 0
    const indicatorContainerWidth = indicatorCount ?
      indicatorCount * indicatorRadius + (indicatorCount - 1) * indicatorMargin
      : 0
    const indicatorStyles = {
      width: indicatorRadius + 'px',
      height: indicatorRadius + 'px',
      marginRight: indicatorMargin + 'px',
      background: indicatorColor,
    }
    const indicatorActiveStyles = {
      ...indicatorStyles,
      background: indicatorActiveColor,
    }
    return (
      <div className="swiper-cursor">
        <ul style={{ width: indicatorContainerWidth + 'px' }}>
          {Array(indicatorCount).fill(0).map((_, i) => (
          <li style={current === i ? { ...indicatorActiveStyles } : { ...indicatorStyles }} key={i}></li>
          ))}
        </ul>
      </div>
    )
  }
}
