import * as React from 'react'

interface IImage {
  url: string
}

export class Image extends React.Component<IImage> {
  public render() {
    const { url } = this.props
    return (
      <div className="image-container">
        <img src={url} alt=""/>
      </div>
    )
  }
}
