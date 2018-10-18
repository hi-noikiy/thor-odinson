import { Location } from '@xrc-inc/buy-sdk/ecnova/api/baidulbs/v1/baidulbs_proto/baidulbs_pb'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'

interface IRecipientSearchLineProps extends RouteComponentProps<{}>{
  recipient: Location
  select: any
}

export class RecipientSearchLine extends React.Component<IRecipientSearchLineProps> {
  public render() {
    const { recipient, select } = this.props
    const address = `${recipient!.getPostalAddress()!.getAdministrativeArea()}${recipient!.getPostalAddress()!.getLocality()}${recipient!.getPostalAddress()!.getSublocality()}`
    return (
      <div onClick={() => {
        select(recipient)
        this.props!.history.goBack()
      }}
        className="recipient-search-item">
        <div className="title">{recipient.getDisplayName()}</div>
        <div className="desc">{address}</div>
      </div>
    )
  }
}
