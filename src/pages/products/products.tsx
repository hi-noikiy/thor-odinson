import { inject, observer } from 'mobx-react'
import * as React from 'react'

import { ProductsStore, StorefrontStore } from '../../store'

interface IProductsPageProps {
  productsStore?: ProductsStore
  storefrontStore?: StorefrontStore
}

@inject('productsStore', 'storefrontStore')
@observer
export class Products extends React.Component<IProductsPageProps> {
  public render() {
    const { productsStore } = this.props
    return (
      <div>
        {productsStore!.loading && <i>Loading</i>}
        <button
          onClick={() => productsStore!.load()}
        >
          Load More
         </button>
      </div>
    )
  }

  private handleRefresh = () => {
    return this.props.productsStore!.reload()
  }
}
