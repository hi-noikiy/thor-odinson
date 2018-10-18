import { GetPageComponentRequest, PageComponent } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { action, computed, observable, runInAction } from 'mobx'

import { newGetPageComponentRequestFromObject } from './datamodel'
import { StorefrontStore } from './storefront'

export class PageComponentStore {

  @observable public loading: boolean = true
  @observable public error?: Error

  @observable private pageComponent!: PageComponent

  @computed get loaded() {
    return !!this.pageComponent
  }

  @computed get parsedData() {
    if (!this.pageComponent) {
      return {}
    }
    try {
      return JSON.parse(this.pageComponent.getData())
    } catch (err) {
      console.warn('Failed to parse component data:', err)
      return
    }
  }
  @computed get name() {
    return `${this.stf.name}/pagecomponents/${this.id}`
  }

  private cli: BuyServiceClient
  private stf: StorefrontStore
  private id: string

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, id: string) {
    this.cli = cli
    this.stf = storefront
    this.id = id
  }

  @action
  public async load() {
    this.loading = true
    let resp: PageComponent
    try {
      resp = await new Promise<PageComponent>((resolve, reject) => {
        this.cli.getPageComponent(newGetPageComponentRequestFromObject({ name: this.name }), (err, resp) => {
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
      this.pageComponent = resp
    })
  }
}
