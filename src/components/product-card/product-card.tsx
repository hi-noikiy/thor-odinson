import * as React from 'react'
import { Link } from 'react-router-dom'

import { ProductStore } from '../../store'

export class ProductCard extends React.Component<{ productStore: ProductStore }> {
  public render() {
    const { productStore } = this.props
    const { product } = productStore
    if (!product) {
      return null
    }
    return (
      <div className="product-card-container">
        <Link className="card no-underline" to={`/products/${productStore.getId()}`}>
          <img className="img" src={product.getImageUrl()} alt="" />
          <div className="summary">
            <h2 className="title">{product.getTitle()}</h2>
            <p className="price">{'￥' + productStore.listPrice}</p>
          </div>
        </Link>
      </div>
    )
  }
}
