import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { action, observable } from 'mobx'

import { ProductsStore } from './products'
import { StorefrontStore } from './storefront'

export class CollectionStore {

  @observable public productsStore: ProductsStore

  private cli: BuyServiceClient
  private stf: StorefrontStore
  private id: string

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, id: string) {
    this.cli = cli
    this.stf = storefront
    this.id = id
    this.productsStore = new ProductsStore(this.cli, this.stf)
  }

  @action.bound
  public async load() {
    this.productsStore.setQuery({
      collection: this.id,
      keyword: '',
      productType: '',
    })
    await this.productsStore.load()
  }

  @action
  public reload() {
    return this.productsStore.reload()
  }
}
