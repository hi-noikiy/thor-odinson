import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import { action, observable, runInAction } from 'mobx'

export abstract class OAuth2Store {
  @observable public redirecting: boolean = false
  @observable public handling: boolean = true
  @observable public error?: Error
  @observable public token?: Token

  @action.bound
  public async redirectToAuthorizationUrl(redirectUrl: string) {
    if (this.redirecting) {
      return
    }
    this.redirecting = true
    let url: string
    try {
      url = await this.authorize(redirectUrl)
      if (!url) {
        throw new Error('No authorization url')
      }
    } catch (error) {
      console.warn(error)
      runInAction(() => {
        this.redirecting = false
        this.error = error
      })
      return
    }
    runInAction(() => {
      this.redirecting = false
      if (typeof window !== 'undefined') {
        window.location.href = url
      }
    })
  }

  @action.bound
  public async handleCallback(code: string, state: string) {
    let resp: Token
    try {
      resp = await this.codeAuthenticate(code, state)
    } catch (error) {
      runInAction(() => {
        this.handling = false
        this.error = error
      })
      return
    }
    runInAction(() => {
      this.saveToken(resp)
      this.token = resp
      this.handling = false
      this.error = undefined
    })
    return resp!
  }

  protected abstract authorize(redirectUrl: string): Promise<string>
  protected abstract codeAuthenticate(code: string, state: string): Promise<Token>
  protected abstract saveToken(token: Token): void
}
