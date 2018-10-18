import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { BuyButton } from '../../components/buy-button'
import { MoneyRange } from '../../components/money'
import { Swiper } from '../../components/swiper'
import { IStores } from '../../provider'
import { ProductStore, ShoppingCartStore, UIState } from '../../store'

interface IMatchParams {
  publicId: string
  id: string
}

interface IProductProps extends RouteComponentProps<IMatchParams> {
  ui?: UIState
  productStore?: ProductStore
  shoppingCartStore?: ShoppingCartStore
}

@inject((stores: IStores, props: RouteComponentProps<IMatchParams>) => ({
  ui: stores.ui,
  productStore: stores.resources.getProductStore(props.match.params.id),
  shoppingCartStore: stores.shoppingCartStore,
}))
@observer
export class Product extends React.Component<IProductProps> {
  public async componentWillMount() {
    this.props.ui!.showModal({ description: '加载中...' })
    await this.props.productStore!.load()
    this.props.ui!.hideModal()
  }

  public componentDidUpdate() {
    if (this.props.productStore!.loaded) {
      this.props.ui!.setNavigationBarTitle(this.props.productStore!.product!.getTitle())
    }
  }

  public render() {
    const { productStore, shoppingCartStore } = this.props

    if (productStore!.loaded) {
      return (
        <div className="product-container">
          <div className="product-swiper-container">
            {/* TODO(lq) */}
            <Swiper>
              {productStore!.product!.getAdditionalImageUrlsList().map((url: string, i: number) => (
                <img src={url} key={i} style={{ display: 'block' }} />
              ))}
            </Swiper>
          </div>
          <div className="product-info">
            <div className="product-price-info">
              <MoneyRange range={productStore!.priceRange!} className="product-saleprice" division="~" />
            </div>
            <div className="product-title">
              <span>{productStore!.product!.getTitle()}</span>
            </div>
            <div className="product-tags">
              <span>{productStore!.product!.getDescription()}</span>
            </div>
          </div>
          <div className="product-desc">
            {productStore!.product!.getDetailsList().map((meta: any, i: number) => (
              <img src={meta.getImage()} key={i} />
            ))}
          </div>
          <BuyButton {...this.props} product={productStore!.product!} />
          {shoppingCartStore!.updating && <b>Updating</b>}
        </div>
      )
    } else if (productStore!.loading) {
      return <div></div>
    } else {
      return <b>{productStore!.error!.message}</b>
    }
  }
}
