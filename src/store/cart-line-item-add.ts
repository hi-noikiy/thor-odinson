import { Product } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import { action, computed, observable, runInAction } from 'mobx'

import { parseMoneyToFloat } from '../utils'

import { Form, IForm, IFormItem, IRadioFormItem, RadioFormItem, RadioOption } from './form'
import { ProductStore, SKU } from './product'
import { ShoppingCartStore } from './shopping-cart'
import { StorefrontStore } from './storefront'

export * from './form'

const VariantTheme = {
  0: 'VARIANT_THEME_UNSPECIFIED',
  1: 'COLOR_SIZE',
  2: 'SIZE',
  3: 'COLOR',
}
const VariantDisplayNames: any = {
  COLOR: '颜色',
  SIZE: '规格',
}

export interface ICartLineItemAddStore {
  productStore: ProductStore | null
  shoppingCartStore: ShoppingCartStore
  storefrontStore: StorefrontStore
  form: IForm
  sku: Product.Variant | null
  cover: string
  price: [number, number]
  quantity: number
  select: (fi: IRadioFormItem, op: RadioOption) => void
  submit: () => void
  setQuantity: (num: number) => void
  init: (productStore: ProductStore) => void
}

export class CartLineItemAddStore implements ICartLineItemAddStore {
  @computed get cover(): string {
    if (!this.product) {
      return ''
    }
    if (!this.sku) {
      return this.product.getImageUrl()
    }
    return this.sku.getImageUrl()
  }
  @computed get sku(): Product.Variant | null {
    if (!this.form.valid) {
      return null
    }
    const its = Array.from(this.form.items.values())
    const pairs: Array<[string, string]> = its.map((i: IFormItem) => {
      const ir = i as IRadioFormItem
      return [i.item, ir.options.filter(o => o.selected).map(o => o.value)[0]] as [string, string]
    })
    const povl = this.product!.getVariantsList()
    const sku = povl.filter(pv =>
      pairs.filter(([t, v]) => {
        const k = t.toLowerCase()
        const p: any = pv.toObject()
        return p[k] && (p[k].id === v || p[k] === v)
      }).length === pairs.length,
    )[0]
    return sku as Product.Variant
  }
  @computed get price(): [number, number] {
    if (!this.productStore) {
      return [0, 0]
    }
    if (!this.form || this.form.invalid || !this.sku) {
      return this.productStore.priceRange
    }
    const p = parseMoneyToFloat(this.sku.getPrice())
    return [p, p]
  }

  @observable public productStore: ProductStore | null
  @observable public form: IForm
  @observable public quantity: number

  public storefrontStore: StorefrontStore
  public shoppingCartStore: ShoppingCartStore
  public product: Product | null

  constructor(shoppingCartStore: ShoppingCartStore, storefrontStore: StorefrontStore) {
    this.form = new Form()
    this.productStore = null
    this.shoppingCartStore = shoppingCartStore
    this.storefrontStore = storefrontStore
    this.product = null
    this.quantity = 1
  }
  @action
  public init(productStore: ProductStore) {
    this.productStore = productStore
    this.product = this.productStore!.product!
    this.quantity = 1

    if (!this.product.getVariantTheme()) {
      throw new Error('no theme specified.')
    }
    this.form = new Form()
    // init skus and their options
    const vts: {[key: string]: any[]} = VariantTheme[this.product.getVariantTheme()]
      .split('_')
      .reduce((a, t) => ({ [t]: [], ...a }), {})
    const vtts = Object.keys(vts)
    if (!vtts.length) {
      throw new Error('no theme specified.')
    }
    // loop skus and collect their options
    const povl = this.product.toObject().variantsList
    for (let i = 0, len = povl.length; i < len; i++) {
      const pov: any = povl[i]
      for (const vtt of vtts) {
        const option = pov[vtt.toLowerCase()]
        if (option) {
          const st = vts[vtt]
          if (st.filter(s => s.name === option.id || s.name === option).length) {
            continue
          }
          st.push({ name: option.id || option, displayName: option.displayName || option })
          break
        }
      }
    }
    // add form item
    for (const vt of vtts) {
      const fi = new RadioFormItem(VariantDisplayNames[vt], vt, [{ required: true }])
      if (!vts[vt].length) {
        continue
      }
      for (const option of vts[vt]) {
        fi.addOption(new RadioOption(option.name))
      }
      this.form.addFormItem(fi)
    }

    // select default item
    if (this.form.items.size) {
      const defFi = Array.from(this.form.items.values())[0] as RadioFormItem
      for (const op of defFi.options) {
        if (!op.disable) {
          runInAction(() => {
            defFi.change(op.value)
          })
          break
        }
      }
    }

    this.form.validateForm()
  }

  @action
  public async select(fio: IRadioFormItem, op: RadioOption) {
    if (op.disable) {
      return
    }
    if (op.value === fio.vals) {
      fio.change('')
    } else {
      fio.change(op.value)
    }
    // refresh options
    const fis = this.form.items
    let to: Array<[string, RadioOption]> = []
    const selected: Array<[string, RadioOption]> = []
    for (const [t, o] of fis.entries()) {
      const fi = o as IRadioFormItem
      const ops: RadioOption[] = []
      for (const fo of fi.options) {
        if (fo.selected) {
          selected.push([fi.item, fo])
          continue
        }
        ops.push(fo)
      }
      if (ops.length === fi.options.length) {
        const fim = fi.item as string
        to = to.concat(ops.map((op: RadioOption) => [fim, op] as [string, RadioOption]))
      }
    }
    for (const s of to) {
      const ok = this.optionIsAvailable(s, selected)
      if (!ok) {
        s[1].disable = true
      }
    }
  }

  @action
  public async submit() {
    try {
      await this.form.submit()
      if (this.form.invalid) {
        throw new Error('请选择商品类型')
      }
      if (!this.sku) {
        throw new Error('SKU不存在')
      }
      await this.shoppingCartStore.increaseSKUQuantity(new SKU(this.storefrontStore, this.sku), this.quantity)
      return true
    } catch (e) {
      throw e
    }
  }

  @action
  public setQuantity(num: number) {
    this.quantity = num
  }

  private optionIsAvailable(tp: [string, RadioOption], selected: Array<[string, RadioOption]>) {
    const vl = this.product!.toObject().variantsList
    const vs = [tp].concat(selected)
    let finded = false
    for (const v of vl) {
      const rv: any = v
      const fl = vs.filter(([k, v]) => {
        const tn = k.toLowerCase()
        return !!rv[tn] && (rv[tn].id === v.value || rv[tn] === v.value)
      }).length
      finded = fl === vs.length
      if (finded) {
        break
      }
    }
    return finded
  }
}
