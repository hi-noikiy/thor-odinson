import { MyProfile, MyRecipient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { grpc } from 'grpc-web-client'
import { action, computed, observable, runInAction } from 'mobx'

import { AccountStore } from './auth'
import { newGetMyProfileRequestFromObject, newJoinStorefrontRequestFromObject } from './datamodel'
import { StorefrontStore } from './storefront'

export class ProfileStore {

  @observable public loading: boolean = true
  @observable public error?: Error
  @observable private myProfile?: MyProfile

  @computed get defaultRecipient(): Promise<MyRecipient> {
    throw new Error('Unimplemented')
  }
  @computed get userId() {
    if (this.loaded) {
      throw new Error('Profile not loaded')
    }
    return undefined
  }
  @computed get loaded() {
    return !!this.myProfile
  }

  private cli: BuyServiceClient
  private stf: StorefrontStore
  private accountStore: AccountStore

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, accountStore: AccountStore) {
    this.cli = cli
    this.stf = storefront
    this.accountStore = accountStore
  }

  @action public async join() {
    this.loading = true
    let resp: MyProfile
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newJoinStorefrontRequestFromObject({ storefront: this.stf.name })
      resp = await new Promise<MyProfile>((resolve, reject) => {
        this.cli.joinStorefront(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (err) {
      console.log(err)
      runInAction(() => {
        this.loading = false
        this.error = err
      })
      return
    }
    runInAction(() => {
      this.loading = false
      this.error = undefined
      this.myProfile = resp
    })
  }

  @action public async load() {
    this.loading = true
    let resp: MyProfile
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newGetMyProfileRequestFromObject({ storefront: this.stf.name })
      resp = await new Promise<MyProfile>((resolve, reject) => {
        this.cli.getMyProfile(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (err) {
      console.log(err)
      runInAction(() => {
        this.loading = false
        this.error = err
      })
      return
    }
    runInAction(() => {
      this.loading = false
      this.error = undefined
      this.myProfile = resp
    })
  }

  @action public signOut() {
    this.myProfile = undefined
    return this.accountStore.destroy()
  }

  public getStorefront() {
    return this.myProfile!.getStorefront()
  }
  public getAvatarUrl() {
    return this.myProfile!.getAvatarUrl()
  }
  public getNickName() {
    return this.myProfile!.getNickName()
  }
  public getDefaultRecipient() {
    if (!this.loaded) {
      return
    }
    return this.myProfile!.getDefaultRecipient()
  }
}
