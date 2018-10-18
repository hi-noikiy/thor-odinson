import * as React from 'react'
import { CSSTransition } from 'react-transition-group'

import { Overlay } from '../overlay'

interface IProps {
  isOpen: boolean
  onClose(): void
}

interface IState { }

export class Modal extends React.Component<IProps, IState> {
  public render() {
    const { isOpen, children, onClose } = this.props
    return (
      <Overlay
        hasBackdrop
        isOpen={isOpen}
        transitionName="modal-transition-container"
        onClose={onClose}
      >
        <div className="modal">
          {children}
        </div>
      </Overlay>
    )
  }
}
