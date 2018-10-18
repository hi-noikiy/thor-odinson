import { MyRecipient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb'
import { grpc } from 'grpc-web-client'
import { action, observable, runInAction } from 'mobx'

import { AccountStore } from './auth'
import { newDeleteMyRecipientRequestFromObject, newMyRecipientFromObject, newUpdateDefaultRecipientRequestFromObject, newUpdateMyRecipientRequestFromObject } from './datamodel'
import { ProfileStore } from './profile'
import { StorefrontStore } from './storefront'

export class RecipientStore {

  @observable public updating = false
  @observable public error?: Error
  @observable public recipient?: MyRecipient

  private cli: BuyServiceClient
  private stf: StorefrontStore
  private accountStore: AccountStore
  private profile: ProfileStore

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, accountStore: AccountStore, profile: ProfileStore, recipient?: MyRecipient) {
    this.cli = cli
    this.stf = storefront
    this.accountStore = accountStore
    this.profile = profile
    if (recipient) {
      this.recipient = recipient
    }
  }
  @action
  public setRecipient(recipient?: MyRecipient.AsObject) {
    this.recipient = newMyRecipientFromObject(recipient)
  }
  public getRecipientId() {
    return this.recipient!.getRecipientId()
  }
  public getFullName() {
    return this.recipient!.getFullName()
  }
  public getEmail() {
    return this.recipient!.getEmail()
  }
  public getPhoneNumber() {
    return this.recipient!.getPhoneNumber()
  }
  public getAdministrativeArea() {
    return this.recipient!.getPostalAddress() && this.recipient!.getPostalAddress()!.getAdministrativeArea()[0]
  }
  public getLocality() {
    return this.recipient!.getPostalAddress() && this.recipient!.getPostalAddress()!.getLocality()
  }
  public getSublocality() {
    return this.recipient!.getPostalAddress() && this.recipient!.getPostalAddress()!.getSublocality()
  }
  public getAddressLinesList() {
    return this.recipient!.getPostalAddress() && this.recipient!.getPostalAddress()!.getAddressLinesList()[0]
  }
  @action.bound
  public async setDefault() {
    this.updating = true
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newUpdateDefaultRecipientRequestFromObject({ storefront: this.stf.name, recipientId: this.recipient!.getRecipientId() })
      console.log(req)
      await new Promise<Empty>((resolve, reject) => {
        this.cli.updateDefaultRecipient(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (error) {
      console.log(error)
      runInAction(() => {
        this.updating = false
        this.error = error
      })
    }
    runInAction(() => {
      this.updating = false
      this.error = undefined
      this.profile.load()
    })
  }

  @action.bound
  public async update(recipientObj: MyRecipient.AsObject,setDefault = false) {
    this.updating = true
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newUpdateMyRecipientRequestFromObject({ myRecipient: recipientObj })
      await new Promise<MyRecipient>((resolve, reject) => {
        this.cli.updateMyRecipient(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (error) {
      console.error(error)
      runInAction(() => {
        this.updating = false
        this.error = error
      })
    }
    runInAction(() => {
      this.updating = false
      this.error = undefined
    })
    try {
      const defaultRecientId = this.profile.getDefaultRecipient() && this.profile.getDefaultRecipient()!.toObject().recipientId
      if (setDefault && defaultRecientId !== recipientObj.recipientId) {
        this.recipient!.setRecipientId(recipientObj.recipientId)
        this.setDefault()
        await this.profile.load()
      } else if (!setDefault &&  defaultRecientId === recipientObj.recipientId) {
        this.recipient!.setRecipientId('')
        this.setDefault()
        await this.profile.load()
      }
    }catch(err){
      console.error(err)
    }
  }

  @action.bound
  public async delete() {
    this.updating = true
    try {
      const jwt = await this.accountStore.allocateJWT()
      const req = newDeleteMyRecipientRequestFromObject({ storefront: this.stf.name, recipientId: this.recipient!.getRecipientId() })
      await new Promise<Empty>((resolve, reject) => {
        this.cli.deleteMyRecipient(req, new grpc.Metadata({ Authorization: `Bearer ${jwt}` }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (error) {
      runInAction(() => {
        this.updating = false
        this.error = error
      })
    }
    runInAction(() => {
      this.updating = false
      this.error = undefined
      this.profile.load()
    })
  }
}
