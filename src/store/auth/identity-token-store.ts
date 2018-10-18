import { Token } from '@xrc-inc/buy-sdk/ecnova/api/type/accesstoken/accesstoken_proto/accesstoken_pb'
import decodeJwt from 'jwt-decode'
import { action, computed, observable, runInAction } from 'mobx'

/**
 * IStorage 提供读取和保存 IdentityToken 的方法
 *
 * 在浏览器环境中可以通过 localStorage 提供这两个方法
 */
export interface IStorage {
  load(key: string): Promise<string | undefined | null>
  save(key: string, value: string): void
  delete(key: string): Promise<any>
}

/**
 * IdentityTokenStore 维护 IdentityToken
 *
 * - IdentityTokenStore 中存在有效的 IdentityToken 时，即表示当前处于登录状态
 * - 子类可通过 setIdentityToken 方法设置 IdentityToken
 */
export abstract class IdentityTokenStore {
  protected storageKey = 'IDENTITY_TOKEN'

  @computed get authenticated() {
    return !!this.identityToken
  }

  /** 解析 AccessToken 得到的 jwt，此字段可用来标识当前程序是否登录 */
  @observable protected jwt?: string
  /** 由 Account 系统签发的 jwt，用于刷新 accessToken */
  @observable protected identityToken?: string
  /** 内部状态，标识是否正在从 storage 中加载 identityToken */
  @observable protected initializing?: Promise<any>
  /** 内部状态，标识是否正在刷新 accessToken */
  @observable protected renewPromise?: Promise<any>

  /** 标识 IdentityToken 是否加载完成 */
  @observable public loading: boolean = true

  private storage: IStorage

  constructor(storage: IStorage) {
    this.storage = storage
    this.initializing = this.initialize()
  }

  /**
   * 返回一个可用的 accessToken
   */
  public async allocateJWT(): Promise<string> {
    await this.initializing
    if (!this.identityToken) {
      throw new Error('Unauthenticated')
    }
    if (this.renewPromise) {
      await this.renewPromise
    }
    if (!this.jwt || this.isExpired(this.jwt)) {
      this.renewPromise = this.renew()
      await this.renewPromise
    }
    return this.jwt!
  }

  /**
   * 设置 IdentityToken，设置之后，即表示登录成功
   * @param jwt
   */
  @action public setIdentityToken(identityToken: string) {
    this.identityToken = identityToken
    this.storage.save(this.storageKey, identityToken)
    this.renewPromise = this.renew()
  }

  @action public async destroy() {
    this.jwt = undefined
    this.identityToken = undefined
    this.initializing = undefined
    this.renewPromise = undefined
    this.storage.delete(this.storageKey)
  }

  /**
   * 从 Storage 中读取 IdentityToken 并且尝试请求 AccessToken
   */
  protected async initialize() {
    let identityToken: string | null | undefined
    try {
      identityToken = await this.storage.load(this.storageKey)
      if (!identityToken) {
        throw new Error('not found identity token in storage')
      }
    } catch (error) {
      runInAction('initializeFinishWithoutIdentityToken', () => {
        this.loading = false
      })
      return
    }
    runInAction('initializeFinishWithIdentityToken', () => {
      this.identityToken = identityToken!
      this.renewPromise = this.renew()
      this.loading = false
    })
  }

  /**
   * 获取 AccessToken 的方法，由子类实现
   * @param jwt identityToken
   */
  protected abstract getAccessToken(jwt: string): Promise<Token>

  protected isExpired(jwt: string): boolean {
    try {
      const { exp } = decodeJwt(jwt)
      return exp * 1000 < Date.now()
    } catch (error) {
      console.warn(`Failed to decode jwt: ${jwt}`)
      return false
    }
  }

  @action.bound
  protected async renew() {
    if (!this.identityToken) {
      throw new Error('IdentityToken is required when renew AccessToken')
    }
    console.info('Renew AccessToken...')
    try {
      const token = await this.getAccessToken(this.identityToken)
      this.jwt = token.getOpaque()
      const d = new Date(token.getExpiry()!.getSeconds() * 1000)
      console.info(`New AccessToken expires at ${d.toLocaleString()}`)
    } catch (err) {
      console.warn(`Renew AccessToken failed: ${err.message}`)
    }
  }
}
