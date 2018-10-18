import { Product } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb'
import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { IStores } from '../../provider'
import {
  AccountStore,
  ICartLineItemAddStore,
  IRadioFormItem,
  ProductStore,
  RadioOption,
  ShoppingCartStore,
  UIState,
} from '../../store'
import { newMyCheckoutLineItemFromObject } from '../../store/datamodel'
import { getProductIdFromName } from '../../utils'
import { Button } from '../button'
import { IconClose } from '../icons'
import { MoneyRange } from '../money'
import { QuantityInput } from '../quantity-input'

interface ICartLineAddProps extends RouteComponentProps<{}> {
  product?: Product
  productId?: string
  ui?: UIState
  checkout: boolean
  productStore?: ProductStore
  formStore?: ICartLineItemAddStore
  shoppingCartStore?: ShoppingCartStore
  accountStore?: AccountStore
  onClose: () => void
}

@inject((stores: IStores, props: any) => {
  const productStore = stores.resources.getProductStore(
    props.productId || getProductIdFromName(props.product.getName()),
  )
  return {
    productStore,
    ui: stores.ui,
    shoppingCartStore: stores.shoppingCartStore,
    formStore: stores.cartLineItemAddStore,
    accountStore: stores.accountStore,
  }
})
@observer
export class CartLineAdd extends React.Component<ICartLineAddProps> {
  public async componentWillMount() {
    const { product, productStore, formStore, ui } = this.props
    ui!.showModal()
    if (!product) {
      await productStore!.load()
    }
    formStore!.init(productStore!)
    ui!.hideModal()
  }

  public render() {
    const { product, productStore, formStore, onClose } = this.props
    const form = formStore!.form

    if (productStore!.loaded && !productStore!.product) {
      return <div></div>
    }
    if (!product && productStore!.loading) {
      return <div></div>
    }
    if (!formStore) {
      return <div></div>
    }
    const formItems = Array.from(form.items.values()) as IRadioFormItem[]

    return (
      <div className="cart-line-add">
        <div className="desc">
          <div className="cover">
            <img src={formStore.cover} />
          </div>
          <div className="text">
            <MoneyRange className="price" range={formStore.price} />
          </div>
        </div>
        <div className="form">
          <div className="vars">
            {formItems.map((fi: IRadioFormItem) => {
              return (
                <div className="form-item" key={fi.name}>
                  <div className="form-label">{fi.name}</div>
                  {fi.options.map((op: RadioOption, i: number) => {
                    return (
                      <div
                        onClick={formStore.select.bind(formStore, fi, op)}
                        className={classNames(
                          op.disable
                            ? 'radio-disable'
                            : fi.vals === op.value
                              ? 'radio-active'
                              : 'radio-default',
                        )}
                        key={i}
                      >
                        {op.value}
                      </div>
                    )
                  })}
                </div>
              )
            })}
            <div className="form-item">
              <div className="form-label">数量</div>
              <div>
                <QuantityInput
                  max={999}
                  quantity={formStore.quantity}
                  onChange={v => formStore.setQuantity(v)}
                />
              </div>
            </div>
          </div>
          <div className="oper">
            <Button
              text="确定"
              onClick={this.onSubmit.bind(this)}
              disabled={form.invalid}
            />
          </div>
        </div>
        <div className="clz-btn" onClick={onClose}>
          <IconClose />
        </div>
      </div>
    )
  }

  private async onSubmit() {
    const { formStore, onClose, checkout, ui } = this.props
    ui!.showModal()
    try {
      await formStore!.submit()
      onClose()
      if (checkout) {
        this.checkout(formStore!.sku!, formStore!.quantity)
        return
      }
      ui!.toast('添加购物车成功')
    } catch (e) {
      ui!.toast(e.message)
    } finally {
      ui!.hideModal()
    }
  }

  private async checkout(sku: Product.Variant, quantity: number) {
    const { shoppingCartStore, accountStore, history, ui } = this.props
    ui!.showModal()
    try {
      if (!accountStore!.authenticated) {
        history.push('/auth/signin')
        return
      }
      const lineItem = sku.toObject() as any
      lineItem.quantity = quantity
      shoppingCartStore!.checkout.setLineItem(newMyCheckoutLineItemFromObject(lineItem))
      await shoppingCartStore!.checkout.update()
      await shoppingCartStore!.load()
      history.push('/checkout')
    } catch(e) {
      ui!.toast(e.message)
    } finally {
      ui!.hideModal()
    }
  }
}
