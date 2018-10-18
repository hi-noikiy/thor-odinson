import { BasicAuthRequest, FederalAuthRequest, GetAccessTokenRequest, SetPasswordRequest, SetUsernameRequest, SetUserInfoRequest } from '@xrc-inc/buy-sdk/ecnova/api/account/v1/account_proto/account_pb'
import { AccountClient, ServiceError } from '@xrc-inc/buy-sdk/ecnova/api/account/v1/account_proto/account_pb_service'
import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { grpc } from 'grpc-web-client'
import { action, observable, runInAction } from 'mobx'

import { promisify } from '../../utils'

import { IdentityTokenStore, IStorage } from './identity-token-store'

/**
 * AccountStore 继承了 JWTStore，并提供从 Account 系统获取 IdentityToken 和 basicAuth 方法
 */
export class AccountStore extends IdentityTokenStore {
  @observable public authenticating: boolean = false
  @observable public federalAuthToken?: Token

  @observable protected jwt?: string

  private cli: AccountClient

  constructor(cli: AccountClient, storage: IStorage) {
    super(storage)
    this.cli = cli
  }

  @action public federalAuth(jwt: string) {
    const req = new FederalAuthRequest()
    req.setScopesList([])
    req.setAutoRegisterNamespace('namespaces/shansong')
    return promisify<Token, ServiceError>(cb => {
      this.cli.federalAuth(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
    })
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

  @action.bound public async basicAuth(obj: BasicAuthRequest.AsObject) {
    const req = new BasicAuthRequest()
    req.setScopesList([])
    req.setPassword(obj.password)
    if (obj.email) {
      req.setEmail(obj.email)
    } else if (obj.phoneNumber) {
      req.setPhoneNumber(obj.phoneNumber)
    } else if (obj.username) {
      req.setUsername(obj.username)
    }
    return new Promise<Token>((resolve, reject) => {
      this.cli.basicAuth(req, (err, resp) => {
        err ? reject(err) : resolve(resp!)
      })
    })
  }

  /**
   * 设置用户名
   * @param username 用户名
   * @param jwt Account 服务的签发的 jwt
   */
  public setUsername(username: string, jwt: string) {
    const req = new SetUsernameRequest()
    req.setUsername(username)
    return promisify(cb => {
      this.cli.setUsername(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
    })
  }

  /**
   * 设置密码
   * @param password 用户名
   * @param jwt Account 服务的签发的 jwt
   */
  public setPassword(password: string, jwt: string) {
    const req = new SetPasswordRequest()
    req.setPassword(password)
    return promisify(cb => {
      this.cli.setPassword(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
    })
  }

  /**
   * 设置用户信息
   * @param userInfo 用户信息
   * @param jwt Account 服务的签发的 jwt
   */
  public setUserInfo(userInfo: SetUserInfoRequest.AsObject, jwt: string) {
    const req = new SetUserInfoRequest()
    req.setDisplayName(userInfo.displayName)
    req.setAvatarUrl(userInfo.avatarUrl)
    console.log(req.toObject())
    return promisify(cb => {
      this.cli.setUserInfo(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
    })
  }
}
