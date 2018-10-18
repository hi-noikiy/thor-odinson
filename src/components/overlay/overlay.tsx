
import classNames from 'classnames'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

export interface IOverlayProps {
  isOpen: boolean
  hasBackdrop?: boolean
  transitionName?: string
  transitionDuration?: number
  className?: string
  onClose(): void
}
interface IOverlayState { }

let counter = 1
const PORTAL_ID = 'portal'
function genPortalID() {
  return `${PORTAL_ID}-${counter++}`
}

export class Overlay extends React.Component<IOverlayProps, IOverlayState> {

  public static defaultProps: Partial<IOverlayProps> = {
    transitionName: 'overlay-content',
    transitionDuration: 500,
  }
  public portal!: HTMLElement
  public portalID: string

  private overlayContentElem = React.createRef<HTMLDivElement>()

  constructor(props: IOverlayProps) {
    super(props)
    this.portalID = genPortalID()
    this.createPortalTarget()
  }

  public componentDidMount() {
    this.updateState(this.props, this.props)
  }

  public componentDidUpdate(prevProps: IOverlayProps) {
    this.updateState(prevProps, this.props)
  }

  public updateState(prevProps: IOverlayProps, props: IOverlayProps) {
    if (!prevProps.isOpen && props.isOpen) {
      document.body.classList.add('overlay-open')
    }
    if (prevProps.isOpen && !props.isOpen) {
      document.body.classList.remove('overlay-open')
    }
  }

  public componentWillUnmount() {
    document.body.removeChild(this.portal)
  }

  public render() {
    const { isOpen, className } = this.props
    return ReactDOM.createPortal(
      <TransitionGroup
        className={classNames('overlay', className, { 'overlay-open': isOpen })}
        enter
        exit
      >
        <React.Fragment>
          {this.maybeRenderBackdrop()}
          {this.maybeRenderChild()}
        </React.Fragment>
      </TransitionGroup>,
      this.portal,
    )
  }

  public renderContent() { }

  private createPortalTarget() {
    this.portal = document.createElement('div')
    this.portal.id = this.portalID
    this.portal.classList.add('portal')
    document.body.appendChild(this.portal)
  }

  private maybeRenderChild = () => {
    const { isOpen, children, transitionName, transitionDuration = 500, onClose } = this.props
    if (!transitionName) {
      return children
    }
    return (
      <CSSTransition
        classNames={classNames(transitionName)}
        timeout={transitionDuration}
        in={isOpen}
        mountOnEnter
        unmountOnExit
        enter
        exit
      >
        <div
          ref={this.overlayContentElem}
          className={classNames('overlay-content', transitionName)}
          onClick={(evt: React.MouseEvent) => {
            const div = evt.target as HTMLDivElement
            if (div !== this.overlayContentElem.current!) {
              return evt.preventDefault()
            }
            if (onClose) {
              onClose()
            }
          }}
        >
          {children}
        </div>
      </CSSTransition>
    )
  }

  private maybeRenderBackdrop = () => {
    const { hasBackdrop, isOpen, transitionDuration = 500 } = this.props
    return (
      <CSSTransition
        classNames={'backdrop'}
        timeout={transitionDuration as number}
        in={isOpen}
        mountOnEnter
        unmountOnExit
        enter
        exit
      >
        <div className={classNames('backdrop', { 'backdrop-transparent': !hasBackdrop })} />
      </CSSTransition>
    )
  }
}
