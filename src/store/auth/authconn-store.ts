import { GetAccessTokenRequest } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/v1/authconnect_proto/authconnect_pb'
import { AuthClient } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/v1/authconnect_proto/authconnect_pb_service'
import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { grpc } from 'grpc-web-client'
import { action, observable } from 'mobx'

import { IdentityTokenStore, IStorage } from './identity-token-store'

export class AuthConnStore extends IdentityTokenStore {
  @observable public authenticating: boolean = false

  @observable protected jwt?: string

  private cli: AuthClient
  protected storageKey = 'AUTH_CONN_IDENTITY_TOKEN'

  constructor(cli: AuthClient, storage: IStorage) {
    super(storage)
    this.cli = cli
  }

  @action public getAccessToken(jwt: string) {
    const req = new GetAccessTokenRequest()
    req.setScopesList([])
    return new Promise<Token>((resolve, reject) => {
      this.cli.getAccessToken(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
        err ? reject(err) : resolve(resp!)
      })
    })
  }
}
