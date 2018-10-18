import * as React from 'react'

interface ITimer {
  remaining: number
  finish: boolean
  startCountingDown: () => number
}

interface ITimerProps {
  total: number
  children(data: ITimer): React.ReactNode
}

interface ITimerState {
  remaining: number
}

export class Timer extends React.Component<ITimerProps, ITimerState> {
  public state: ITimerState = {
    remaining: 0,
  }

  private timer!: number

  public render() {
    const { remaining } = this.state
    return this.props.children({
      remaining,
      finish: remaining === 0,
      startCountingDown: this.startCountingDown,
    })
  }

  public startCountingDown = () => {
    const counting = () => {
      this.setState(
        {
          remaining: this.state.remaining
            ? this.state.remaining - 1
            : this.props.total,
        },
        () => {
          if (this.state.remaining === 0) {
            clearInterval(this.timer)
          }
        },
      )
    }
    counting()
    this.timer = setInterval(counting, 1000) as any
    return this.timer
  }
}
