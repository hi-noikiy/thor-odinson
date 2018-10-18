import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Portal } from 'react-portal'
import { RouteComponentProps } from 'react-router-dom'

import { Button } from '../../components/button'
import { RecipientLine } from '../../components/recipient-line'
import { ProfileStore, RecipientStore, UIState } from '../../store'
import { IRecipientsStore } from '../../store/recipients'

interface IRecipientsPageProps extends RouteComponentProps<{}> {
  ui?: UIState
  recipientsStore?: IRecipientsStore
  profileStore?: ProfileStore
  recipientStore?: RecipientStore
}

@inject('recipientsStore', 'ui', 'profileStore', 'recipientStore')
@observer
export class RecipientsPage extends React.Component<IRecipientsPageProps> {
  constructor(props: IRecipientsPageProps) {
    super(props)
    props.ui!.setNavigationBarTitle('收货地址')
  }
  public async componentDidMount() {
    this.props.ui!.showModal({ description: '加载中...' })
    if (!this.props.profileStore!.loaded) {
      await this.props.profileStore!.load()
    }
    const { recipientsStore } = this.props
    recipientsStore!.load()
    this.props.ui!.hideModal()
  }

  public render() {
    const { recipientsStore } = this.props
    return (
      <div className="recipients">
        {!recipientsStore!.loading && !recipientsStore!.recipients.length && (
          <div className="no-recipient">
            <img src={require('../../public/images/no-recipient-inco.svg')} alt="" />
            地址还是空的
          </div>
        )}
        {
          !recipientsStore!.loading && recipientsStore!.recipients.length > 0 && recipientsStore!.recipients.map((r, i) => (
            <RecipientLine key={i} recipient={r} {...this.props} />
          ))
        }
        <Portal>
          <div className="bottom-action-wrapper">
            <div className="to-create-recipient-link" onClick={this.goToAddRecipient}>
              <Button text="+ 新建地址" className="create-recipient-button"></Button>
            </div>
          </div>
        </Portal>
      </div>
    )
  }
  public goToAddRecipient = () => {
    const { recipientStore, history } = this.props
    recipientStore!.setRecipient()
    history.push('/create-recipient')
  }
}
