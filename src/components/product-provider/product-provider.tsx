import { inject, observer } from 'mobx-react'
import * as React from 'react'

import { IStores } from '../../provider'
import { ProductProviderStore } from '../../store'
import { ProductStore } from '../../store'

interface IProductProviderProps {
  id: string
  collection?: {
    id: string,
  }
  products?: {
    idsList: string[],
  }
  productType?: {
    id: string,
  }
  productProviderStore?: ProductProviderStore
  children(prodStores: ProductStore[], loading: boolean, loaded: boolean, error?: Error): React.ReactNode
}

@inject((stores: IStores, props: IProductProviderProps) => ({
  productProviderStore: stores.resources.getProductProviderStore(props.id, { collection: props.collection, products: props.products }),
}))

@observer
export class ProductProvider extends React.Component<IProductProviderProps> {
  public componentDidMount() {
    this.props.productProviderStore!.load()
  }
  public render() {
    const { productProviderStore, children } = this.props
    const { loading, loaded, error, prodStores } = productProviderStore!
    return (
      <div className="product-provider-container">
        {
          children(prodStores, loading, loaded, error)
        }
      </div>
    )
  }
}
