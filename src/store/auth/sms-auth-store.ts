import { AuthorizeRequest, CodeAuthenticateRequest } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/smsauthconnect/v1/smsauthconnect_proto/smsauthconnect_pb'
import { ServiceError, SMSAuthConnectClient } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/smsauthconnect/v1/smsauthconnect_proto/smsauthconnect_pb_service'
import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import { action, computed, observable, runInAction } from 'mobx'

export class SMSAuthStore {
  @observable public identityToken?: Token
  @observable public authorized: boolean = false
  @observable public authorizing: boolean = false
  @observable public codeAuthenticated: boolean = false
  @observable public codeAuthenticating: boolean = false
  @observable public error?: ServiceError

  @computed get name() {
    return `authconns/${this.id}`
  }

  private cli: SMSAuthConnectClient
  private id: string

  constructor(cli: SMSAuthConnectClient, authConnId: string) {
    this.cli = cli
    this.id = authConnId
  }

  @action.bound public authorize(phoneNumber: string) {
    const req = new AuthorizeRequest()
    req.setAuthConn(this.name)
    req.setPhoneNumber(phoneNumber)
    this.authorizing = true
    return new Promise<Empty>((resolve, reject) => {
      this.cli.authorize(req, (err, resp) => {
        runInAction(() => {
          this.authorizing = false
          this.error = err
          err ? reject(err) : resolve(resp!)
        })
      })
    })
  }

  @action.bound public codeAuthenticate(phoneNumber: string, code: string) {
    const req = new CodeAuthenticateRequest()
    req.setAuthConn(this.name)
    req.setCode(code)
    req.setPhoneNumber(phoneNumber)
    this.codeAuthenticating = true
    return new Promise<Token>((resolve, reject) => {
      this.cli.codeAuthenticate(req, (err, resp) => {
        runInAction(() => {
          if (err) {
            this.error = err
            reject(err)
          } else {
            this.identityToken = resp!
            this.codeAuthenticated = true
            resolve(resp!)
          }
          this.codeAuthenticating = false
        })
      })
    })
  }
}
