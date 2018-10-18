import { ListMyRecipientsResponse, MyRecipient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient, ServiceError } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import { grpc } from 'grpc-web-client'
import { action, observable, runInAction } from 'mobx'

import { promisify } from '../utils'

import { AccountStore } from './auth'
import { newCreateRecipientRequestFromObject, newListMyRecipientsRequestFromObject, newUpdateDefaultRecipientRequestFromObject } from './datamodel'
import { ProfileStore } from './profile'
import { StorefrontStore } from './storefront'

export interface IRecipientsStore {
  recipients: MyRecipient[]
  loading: boolean
  error?: Error
  creating: boolean
  load(): Promise<void>
  create(recipientObj: MyRecipient.AsObject): Promise<void>
}

export class RecipientsStore implements IRecipientsStore {

  @observable public recipients: MyRecipient[] = []
  @observable public loading: boolean = true
  @observable public error?: Error
  @observable public creating: boolean = false

  private cli: BuyServiceClient
  private accountStore: AccountStore
  private stf: StorefrontStore
  private profile: ProfileStore

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, accountStore: AccountStore, profile: ProfileStore) {
    this.cli = cli
    this.accountStore = accountStore
    this.stf = storefront
    this.profile = profile
  }

  @action
  public async load() {
    this.loading = true
    let resp: ListMyRecipientsResponse
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newListMyRecipientsRequestFromObject({ storefront: this.stf.name })
      resp = await promisify<ListMyRecipientsResponse,ServiceError>(cb => {
        this.cli.listMyRecipients(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
      })
    } catch (err) {
      console.warn(err)
      runInAction(() => {
        this.loading = false
        this.error = err
      })
      return
    }
    runInAction(() => {
      this.loading = false
      this.error = undefined
      this.recipients = resp.getMyRecipientsList()
    })
  }

  @action
  public async create(recipientObj: MyRecipient.AsObject, setDefault = false) {
    this.creating = true
    if(!this.recipients.length){
      setDefault = true
    }
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newCreateRecipientRequestFromObject({ recipient: recipientObj, storefront: this.stf.name })
      const resp = await promisify<MyRecipient,ServiceError>(cb => {
        this.cli.createRecipient(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }),cb)
      })
      if (setDefault) {
        const reqDefault = newUpdateDefaultRecipientRequestFromObject({ storefront: this.stf.name, recipientId: resp.toObject().recipientId })
        await promisify<Empty,ServiceError>(cb => {
          this.cli.updateDefaultRecipient(reqDefault, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), cb)
        })
        await this.profile.load()
      }
    } catch (error) {
      runInAction(() => {
        this.creating = false
        this.error = error
      })
    }
    runInAction(() => {
      this.creating = false
      this.error = undefined
    })
    this.load()
  }
}
