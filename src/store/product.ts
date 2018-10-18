import { Product } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { action, computed, observable, runInAction } from 'mobx'

import { parseMoneyToFloat } from '../utils'

import { newGetProductRequestFromObject } from './datamodel'
import { StorefrontStore } from './storefront'

export class ProductStore {

  @computed get loaded(): boolean {
    return !!this.product
  }
  @computed get listPrice(): number {
    if (!this.product) {
      return 0.0
    }
    return Math.min(...this.product.getVariantsList().map(v =>
      parseMoneyToFloat(v.getPrice()),
    ))
  }
  @computed get priceRange(): [number, number] {
    if (!this.product) {
      return [0, 0]
    }
    const arr = this.product.getVariantsList().map(v =>
      parseMoneyToFloat(v.getPrice()),
    )
    return [Math.min(...arr), Math.max(...arr)]
  }
  @computed get attributes(): { [key in 'color' | 'size']: string[] } {
    throw new Error('Method not implemented')
  }
  @computed get name() {
    return `${this.stf.name}/products/${this.id}`
  }

  @observable public loading: boolean = true
  @observable public error?: Error
  @observable public skus: SKU[] = []
  @observable public product?: Product

  private cli: BuyServiceClient
  private stf: StorefrontStore
  private id: string

  constructor(cli: BuyServiceClient, storefront: StorefrontStore, id: string) {
    this.cli = cli
    this.stf = storefront
    this.id = id
  }

  @action public setProduct(product: Product) {
    this.product = product
    this.loading = false
  }

  @action
  public async load() {
    this.loading = true
    let resp: Product
    try {
      resp = await new Promise<Product>((resolve, reject) => {
        this.cli.getProduct(newGetProductRequestFromObject({ name: this.name }), (err, resp) => {
          err ? reject(err) : resolve(resp!)
        })
      })
    } catch (err) {
      console.error(err)
      runInAction(() => {
        this.loading = false
        this.error = err
      })
      return
    }
    runInAction(() => {
      this.loading = false
      this.error = undefined
      this.product = resp
      this.skus = resp.getVariantsList().map(v => new SKU(this.stf, v))
    })
  }

  public getId() {
    return this.id
  }
}

export class SKU {
  @computed get skuName() {
    return `${this.stf.name}/skus/${this.variant.getSkuId()}`
  }
  @computed get id() {
    return this.variant.getSkuId()
  }

  private variant: Product.Variant
  private stf: StorefrontStore

  constructor(storefront: StorefrontStore, variant: Product.Variant) {
    this.stf = storefront
    this.variant = variant
  }

  public getVariant() {
    return this.variant
  }
}
