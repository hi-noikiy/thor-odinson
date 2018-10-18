import { MyRecipient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { ProfileStore, RecipientStore, ShoppingCartStore } from '../../store'
import { IconRecipientEdit } from '../icons'

interface IRecipientLinePage extends RouteComponentProps<{}> {
  recipient: MyRecipient
  recipientStore?: RecipientStore,
  shoppingCartStore?: ShoppingCartStore,
  profileStore?: ProfileStore
}

@inject('recipientStore', 'shoppingCartStore')
@observer
export class RecipientLine extends React.Component<IRecipientLinePage> {
  public render() {
    const { recipient, profileStore } = this.props
    const postalAddress = recipient.getPostalAddress()
    const defaultRecientId = profileStore!.getDefaultRecipient() && profileStore!.getDefaultRecipient()!.toObject().recipientId
    if (!postalAddress) {
      return null
    }
    return (
      <div className="recipient-line">
          <div className="recipient-line-address" onClick={this.chooseRecipient}>
            <div>
              <span className="name">{recipient.getFullName()}</span>
              <span>{recipient.getPhoneNumber()}</span>
              {defaultRecientId === recipient.getRecipientId() &&
                <span className="is-default">默认</span>
              }
            </div>
            <div>
            {postalAddress!.getAdministrativeArea()}{postalAddress!.getLocality()}{postalAddress!.getSublocality()}{postalAddress!.getAddressLinesList()}
            </div>
        </div>
        <div className="recipient-line-edit" onClick={this.goToEdit}><IconRecipientEdit color="#C4C9D5"/></div>
      </div>
    )
  }
  public chooseRecipient = () => {
    const { history, location, shoppingCartStore, recipient } = this.props
    if (location.search.includes('from=checkout')) {
      shoppingCartStore!.checkout.setRecipient(recipient)
      history.goBack()
    }
  }

  public goToEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    this.props.recipientStore!.setRecipient(this.props.recipient.toObject())
    const { location } = this.props
    let search = '?update'
    if (location.search.includes('from=checkout')) {
      search += '&from=checkout'
    }
    this.props.history.push('/create-recipient' + search)
  }
}
