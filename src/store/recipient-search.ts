import { action, observable, runInAction } from 'mobx'

import { Location, SuggestLocationsResponse } from '@xrc-inc/buy-sdk/ecnova/api/baidulbs/v1/baidulbs_proto/baidulbs_pb'
import { BaiduLBSClient } from '@xrc-inc/buy-sdk/ecnova/api/baidulbs/v1/baidulbs_proto/baidulbs_pb_service'

import { MyRecipient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'

import { grpc } from 'grpc-web-client'

import { RecipientStore } from '../store'

import { AccountStore, AuthConnStore } from './auth'
import { newSuggestLocationsRequestFromObject } from './datamodel'

export interface IRecipientSearch {
  loading: boolean
  recipients: any[]

  placeSuggestion(qs: string): void
  reset(): void
  select(recipient: any): any
}

export class RecipientSearchStore {

  @observable public loading = false
  @observable public recipients: Location[] = []
  @observable public recipient?: RecipientStore

  private cli: BaiduLBSClient
  private lastQs: string = ''
  private accountStore: AccountStore
  constructor(cli: BaiduLBSClient, accountStore: AccountStore, recipientStore?: RecipientStore) {
    this.cli = cli
    this.accountStore = accountStore
    this.recipient = recipientStore
  }

  @action.bound
  public async placeSuggestion(qs: string) {
    this.loading = true
    qs = qs.trim()
    if (qs === this.lastQs) {
      return
    }
    this.lastQs = qs
    if (qs.trim() === '') {
      return this.reset()
    }
    const jwt = await this.accountStore.allocateJWT()
    const req = newSuggestLocationsRequestFromObject({ query: qs, region: '北京市', showLocationsInRegionOnly: true })
    const res = await new Promise<SuggestLocationsResponse>((resolve, reject) => {
      this.cli.suggestLocations(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
        err ? reject(err) : resolve(resp!)
      })
    })
    runInAction(() => {
      this.loading = false
      this.recipients = res.getLocationsList()
    })
  }

  @action.bound
  public reset() {
    this.recipients = []
  }

  @action.bound
  public select(recipient: any) {
    try {
      const oldRecipientObj = this.recipient!.recipient!.toObject()
      const postalAddress = recipient.toObject().postalAddress
      const geolocation = recipient.toObject().geolocation
      const newRecipient = { ...oldRecipientObj, postalAddress, latLng: geolocation } as MyRecipient.AsObject
      newRecipient.postalAddress!.addressLinesList[0] = recipient.toObject().displayName
      newRecipient.postalAddress!.addressLinesList[1] = oldRecipientObj.postalAddress!.addressLinesList[1]
      this.recipient!.setRecipient(newRecipient)
    } catch(error) {
      console.error(error)
    }
  }
}
