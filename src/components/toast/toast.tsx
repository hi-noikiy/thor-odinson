import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { CSSTransition } from 'react-transition-group'

import { IStores } from '../../provider'

interface IState {
  text: string
  isOpen: boolean
}

@inject((stories: IStores) => ({
  text: stories.ui.toastText,
  isOpen: !!stories.ui.toastText,
}))
@observer
export class Toast extends React.Component<Partial<IState>, IState> {
  constructor(props: IState) {
    super(props)
    this.state = props
  }

  public componentWillReceiveProps(nextProps: Partial<IState>) {
    this.setState({
      text: nextProps.text || this.state.text,
      isOpen: !!nextProps.isOpen,
    })
  }

  public render() {
    const { text, isOpen } = this.state
    return (
      <CSSTransition
        classNames="toast-transition"
        timeout={1500}
        in={!!isOpen}
        mountOnEnter
        unmountOnExit
      >
        <div className="toast-container">
          <div>{text}</div>
        </div>
      </CSSTransition>
    )
  }
}
