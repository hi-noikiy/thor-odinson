import { GetAccessTokenRequest } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/v1/authconnect_proto/authconnect_pb'
import { AuthClient } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/v1/authconnect_proto/authconnect_pb_service'
import { OAuth2AuthorizeResponse } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/wxauthconnect/v1/wxauthconnect_proto/wxauthconnect_pb'
import { ServiceError, WXAuthConnectClient } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/wxauthconnect/v1/wxauthconnect_proto/wxauthconnect_pb_service'
import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { grpc } from 'grpc-web-client'
import decodeJwt from 'jwt-decode'
import { computed, observable } from 'mobx'

import { promisify } from '../../utils'
import { newWxCodeAuthenticateRequestFromObject, newWxOAuth2AuthorizeRequestFromObject } from '../datamodel'

import { IStorage } from './identity-token-store'
import { OAuth2Store } from './oauth2-store'

export class WxAuth extends OAuth2Store {
  @computed get name() {
    return `authconns/${this.id}`
  }

  @observable public openId?: string

  private id: string
  private cli: WXAuthConnectClient
  private authCli: AuthClient
  private storage: IStorage

  constructor(cli: WXAuthConnectClient, authCli: AuthClient, id: string, storage: IStorage) {
    super()
    this.cli = cli
    this.authCli = authCli
    this.id = id
    this.storage = storage
    this.storage.load('WXAUTH_OPEN_ID').then(v => {
      if (v) {
        this.openId = v
      }
    })
  }

  public async authorize(redirectUrl: string) {
    const resp = await promisify<OAuth2AuthorizeResponse, ServiceError>(cb => {
      const req = newWxOAuth2AuthorizeRequestFromObject({
        authConn: this.name,
        redirectUrl,
      })
      this.cli.oAuth2Authorize(req, cb)
    })
    return resp.getAuthorizationCodeUrl()
  }

  public async codeAuthenticate(code: string, state: string) {
    // codeAuthenticate 拿到的是 IdentityToken，使用这个 token 请求 AuthConnect 服务的
    // GetAccessToken 接口返回的 jwt 中包含用户的 openid
    const identityToken = await promisify<Token, ServiceError>(cb => {
      const req = newWxCodeAuthenticateRequestFromObject({
        authConn: this.name,
        code,
        state,
      })
      this.cli.codeAuthenticate(req, cb)
    })

    const req = new GetAccessTokenRequest()
    const token = await await promisify<Token, any>(cb => {
      this.authCli.getAccessToken(req, new grpc.Metadata({ Authorization: `Bearer ${identityToken.getOpaque()}` }), cb)
    })
    return token
  }

  public saveToken(token: Token) {
    const { sub } = decodeJwt(token.getOpaque())
    this.openId = sub.split('@')[0]
    this.storage.save('WXAUTH_OPEN_ID', this.openId!)
  }
}
