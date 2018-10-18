import { OAuth2ConnectClient, ServiceError } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/oauth2connect/v1/oauth2connect_proto/oauth2connect_pb_service'
import { OAuth2AuthorizeResponse } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/wxauthconnect/v1/wxauthconnect_proto/wxauthconnect_pb'
import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { computed } from 'mobx'

import { promisify } from '../../utils'
import { newOAuth2AuthorizeRequestFromObject, newOAuth2CodeAuthenticateRequestFromObject } from '../datamodel'

import { IStorage } from './identity-token-store'
import { OAuth2Store } from './oauth2-store'

export class GithubOAuth2Store extends OAuth2Store {
  @computed get name() {
    return `authconns/${this.id}`
  }

  private id: string
  private cli: OAuth2ConnectClient
  private storage: IStorage

  constructor(cli: OAuth2ConnectClient, authConnId: string, storage: IStorage) {
    super()
    this.cli = cli
    this.id = authConnId
    this.storage = storage
  }

  public async authorize(redirectUrl: string) {
    const resp = await promisify<OAuth2AuthorizeResponse, ServiceError>(cb => {
      this.cli.authorize(newOAuth2AuthorizeRequestFromObject({ authConn: this.name, redirectUrl }), cb)
    })
    return resp.getAuthorizationCodeUrl()
  }

  public codeAuthenticate(code: string, state: string) {
    return promisify<Token, ServiceError>(cb => {
      this.cli.codeAuthenticate(newOAuth2CodeAuthenticateRequestFromObject({ authConn: this.name, code, state }), cb)
    })
  }

  public authenticate() {
    throw new Error('Method not implemented')
  }

  public saveToken(token: Token) {
    this.storage.save('WXAUTH_OPEN_ID', token.getOpaque())
  }
}
