import { Page } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { computed, observable, runInAction } from 'mobx'

import { newGetLandingPageRequestFromObject } from './datamodel'
import { PageStore } from './page'

export class StorefrontStore {

  @observable public landingPage: LandingPageStore

  @computed get loadingLandingPage() {
    return this.landingPage.loading
  }
  @computed get name() {
    return `storefronts/${this.publicId}`
  }

  private cli: BuyServiceClient
  private publicId: string

  constructor(cli: BuyServiceClient, publicId: string) {
    this.cli = cli
    this.publicId = publicId
    this.landingPage = new LandingPageStore(this.cli, this)
  }

  public async loadLandingPage(): Promise<void> {
    runInAction(() => {
      this.landingPage.loading = true
    })
    let resp: Page
    try {
      const req = newGetLandingPageRequestFromObject({ storefront: this.name })
      resp = await new Promise<Page>((resolve, reject) => {
        this.cli.getLandingPage(req, (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (err) {
      console.log(err)
      runInAction(() => {
        this.landingPage.loading = false
        this.landingPage.error = err
      })
      return
    }
    runInAction(() => {
      this.landingPage.setPage(resp)
    })
  }
}

export class LandingPageStore extends PageStore {
  constructor(cli: BuyServiceClient, storefront: StorefrontStore) {
    super(cli, storefront, '')
  }
}
