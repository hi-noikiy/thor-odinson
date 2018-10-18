import ClassNames from 'classnames'
import * as PullToRefresh from 'pulltorefreshjs'
import * as React from 'react'

interface IScrollViewProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh(): Promise<any> | any
}

export class ScrollView extends React.Component<IScrollViewProps> {

  private handler: any

  public componentDidMount() {
    this.handler = PullToRefresh.init({
      mainElement: '.ptr-content',
      triggerElement: '.ptr-trigger',
      distThreshold: 60,
      distMax: 80,
      onRefresh: this.props.onRefresh,
    })
  }

  public componentWillUnmount() {
    this.handler.destroy()
  }

  public render() {
    const { onRefresh, className, ...attrs } = this.props
    return (
      <div {...attrs} className={ClassNames(className, 'ptr-trigger')}>
        <div className="ptr-content">
          {this.props.children}
        </div>
      </div>
    )
  }
}
