import { inject, observer } from 'mobx-react'
import * as React from 'react'

import { UIState } from '../../store'
import { IconLoading } from '../icons'
import { Overlay } from '../overlay'

interface IProps {
  ui?: UIState
}

interface IState {

}

@inject('ui')
@observer
export class LoadingModal extends React.Component<IProps, IState> {
  public render() {
    const { ui } = this.props
    return (
      <Overlay
        isOpen={ui!.modal.isOpen}
        transitionName="loading-overlay"
        className="loading-modal-overlay"
      >
        <div className="loading-indicator-overlay">
          <IconLoading color="white" />
          {ui!.modal.description && <div className="description">{ui!.modal.description}</div>}
        </div>
      </Overlay>
    )
  }
}
