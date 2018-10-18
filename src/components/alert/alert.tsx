import { spawn } from 'child_process'
import * as React from 'react'

import { Overlay } from '../overlay'

interface IProps {
  isOpen: boolean
  icon?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?(): void
  onCancel?(): void
  onClose?(): void
}

interface IState { }

export class Alert extends React.Component<IProps, IState> {
  public render() {
    const { isOpen, onClose, onConfirm, onCancel, icon, title, description, confirmText, cancelText } = this.props
    return (
      <Overlay
        hasBackdrop
        isOpen={isOpen}
        transitionName="modal-transition-container"
        onClose={onClose}
      >
        <div className="alert">
          {icon && <span className="alert-icon">{icon}</span>}
          {title && <h3 className="alert-title">{title}</h3>}
          {description && <p className="alert-description">{description}</p>}
          <div className="alert-button-group">
            <button className="cancel-button" onClick={onCancel}>{cancelText || '取消'}</button>
            <button className="confirm-button" onClick={onConfirm}>{confirmText || '确认'}</button>
          </div>
        </div>
      </Overlay>
    )
  }
}
