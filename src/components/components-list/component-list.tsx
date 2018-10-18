import { observer } from 'mobx-react'
import React from 'react'
import { RouteComponentProps } from 'react-router'

import { BuyButton } from '../../components/buy-button'
import { Image } from '../../components/image'
import { ImageLink } from '../../components/image-link'
import { ProductCard } from '../../components/product-card'
import { ProductProvider } from '../../components/product-provider'
import { IconLoading } from '../icons'

interface IComponentsListProps extends RouteComponentProps<{}> {
  pageId: string
  components: any[]
}
@observer
export class ComponentsList extends React.Component<IComponentsListProps> {
  public render() {
    const { components, pageId } = this.props
    return (
      <div>
        {components.map((component: any, i: number) => {
          if (component.Image) {
            return <Image {...component.Image} key={`image${i}`} />
          }
          if (component.ImageLink) {
            return <ImageLink {...component.ImageLink} key={`imageLink${i}`} />
          }
          if (component.Products) {
            return (
              <ProductProvider
                id={`${pageId}${i}`}
                {...component.Products}
                key={`products${i}`}
              >
                {(prodStores, loading, loaded, error) => {
                  if (loaded) {
                    return prodStores.map((productStore, i: number) => (
                      <ProductCard productStore={productStore} key={i} />
                    ))
                  }
                  if (loading) {
                    return <div className="loading"><IconLoading /></div>
                  } else if (error) {
                    return <b>{error.message}</b>
                  }
                }}
              </ProductProvider>
            )
          }
          if (component.BuyButton && component.BuyButton.show) {
            return <BuyButton key={`buy-button-${component.BuyButton.productId}`} productId={component.BuyButton.productId} {...this.props}/>
          }
        })}
      </div>
    )
  }
}
