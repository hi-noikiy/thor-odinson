import { BatchGetProductsResponse, Product } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { action, computed, observable, runInAction } from 'mobx'

import { CollectionStore } from './collection'
import { newBatchGetProductsRequestFromObject } from './datamodel'
import { ProductStore } from './product'
import { StorefrontStore } from './storefront'

export class ProductProviderStore {

  @computed get loaded(): boolean {
    return !!this.prodStores.length
  }

  @observable public prodStores: ProductStore[] = []
  @observable public loading: boolean = true
  @observable public error?: Error

  private cli: BuyServiceClient
  private stf: StorefrontStore
  private collectionStore?: CollectionStore
  private productIdsList?: string[]

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, options: {collectionStore?: CollectionStore , productIdsList?: string[]}) {
    this.cli = cli
    this.stf = storefront
    if (options.collectionStore) {
    this.collectionStore = options.collectionStore
    }
    if (options.productIdsList && options.productIdsList.length !== 0) {
      this.productIdsList = options.productIdsList
    }
  }

  @action.bound
  public async load() {
    this.loading = true
    const { collectionStore, productIdsList, stf, cli } = this
    if (collectionStore) {
      await collectionStore.load()
      runInAction(() => {
        this.prodStores = collectionStore.productsStore.products
        this.loading = false
      })
    }
    if (productIdsList) {
      let resp: BatchGetProductsResponse
      try {
        resp = await new Promise<BatchGetProductsResponse>((resolve, reject) => {
          const namesList = productIdsList.map(id => `${stf.name}/products/${id}`)
          cli.batchGetProducts(newBatchGetProductsRequestFromObject({ namesList, storefront: stf.name }), (err, resp) => {
            err ? reject(err) : resolve(resp!)
          })
        })
      } catch (err) {
        console.log(err)
        runInAction(() => {
          this.loading = false
          this.error = err
        })
      }
      runInAction(() => {
        this.loading = false
        this.error = undefined
        this.prodStores = resp.getProductsList().map((product: Product, i: number) => {
          const store = new ProductStore(this.cli, this.stf, this.productIdsList![i])
          store.setProduct(product)
          return store
        })
      })
    }
  }
}
