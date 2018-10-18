import { SearchProductsQuery, SearchProductsResponse } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { action, computed, observable, runInAction } from 'mobx'

import { newSearchProductsRequestFromObject } from './datamodel'
import { ProductStore } from './product'
import { StorefrontStore } from './storefront'
import { productIdFromName } from './utils'

export class ProductsStore implements ProductsStore {

  @computed get hasMore() {
    return this.nextPageToken !== undefined
  }

  @computed get isFirstPage() {
    return this.nextPageToken === ''
  }

  @observable public products: ProductStore[] = []
  @observable public loading: boolean = true
  @observable public reloading: boolean = false
  @observable public error?: Error
  @observable private nextPageToken?: string = ''
  @observable private query: SearchProductsQuery.AsObject = {
    keyword: '',
    productType: '',
    collection: '',
  }

  private cli: BuyServiceClient
  private stf: StorefrontStore
  constructor(cli: BuyServiceClient, storefront: StorefrontStore) {
    this.cli = cli
    this.stf = storefront
  }

  public setQuery(query: SearchProductsQuery.AsObject) {
    this.query = query
  }

  @action.bound
  public async load() {
    if (!this.hasMore) {
      return
    }
    this.loading = true
    let resp: SearchProductsResponse
    try {
      const req = newSearchProductsRequestFromObject({
        pageSize: 20,
        pageToken: '',
        query: this.query,
        storefront: this.stf.name,
      })
      resp = await new Promise<SearchProductsResponse>((resolve, reject) => {
        this.cli.searchProducts(req, (err, resp) => {
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
      const prods = resp.getProductsList().map(prod => {
        const prodStore = new ProductStore(this.cli, this.stf, productIdFromName(prod.getName()))
        prodStore.setProduct(prod)
        return prodStore
      })
      if (this.isFirstPage) {
        this.products = prods
      } else {
        this.products.push(...prods)
      }
      this.nextPageToken = resp.getNextPageToken()
    })
  }

  @action
  public reload() {
    this.nextPageToken = ''
    return this.load()
  }
}
