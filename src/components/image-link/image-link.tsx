import * as React from 'react'
import { Link } from 'react-router-dom'

interface IImageLink {
  link: any
  url: string
}

export class ImageLink extends React.Component<IImageLink> {
  public render() {
    const { url, link } = this.props
    let pageUrl: string = ''
    if (link.product) {
      pageUrl = `/products/${link.product}`
    }
    if (link.page) {
      pageUrl = `/pages/${link.page}`
    }
    if (link.url) {
      pageUrl = url
    }
    return (
      <div className="image-link-container">
        <Link to={pageUrl}>
          <img src={url} alt=""/>
        </Link>
      </div>
    )
  }
}
