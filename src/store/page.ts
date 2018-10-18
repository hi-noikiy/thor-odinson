import { Page } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { action, computed, observable, runInAction } from 'mobx'

import { newGetPageRequestFromObject } from './datamodel'
import { StorefrontStore } from './storefront'

export interface IPageStore {
  loading: boolean
  loaded: boolean
  error?: Error
  parsedData?: any
  load(): Promise<void>
}

export interface IPageStoreConstructorConfig {
  publicId: string
}

export class PageStore implements IPageStore {
  @observable public loading: boolean = true
  @observable public error?: Error

  @computed get name() {
    return `${this.stf.name}/pages/${this.id}`
  }
  @computed get loaded() {
    return !!this.page
  }
  @computed get parsedData() {
    if (!this.page) {
      return {}
    }
    try {
      return JSON.parse(this.page.getData())
    } catch (err) {
      console.warn(err)
      return
    }
  }

  @observable private page?: Page

  private cli: BuyServiceClient
  private stf: StorefrontStore
  private id: string

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, id: string) {
    this.cli = cli
    this.stf = storefront
    this.id = id
  }

  @action public setPage(page: Page) {
    this.page = page
    this.loading = false
  }

  @action.bound
  public async load() {
    this.loading = true
    let resp: Page
    try {
      resp = await new Promise<Page>((resolve, reject) => {
        this.cli.getPage(newGetPageRequestFromObject({ name: this.name }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
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
      this.page = resp
    })
  }
}
