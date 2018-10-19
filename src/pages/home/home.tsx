import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { ComponentsList } from '../../components/components-list'
import { ScrollView } from '../../components/scroll-view'

import { StorefrontStore, UIState } from '../../store'

interface IHomePage extends RouteComponentProps<{}> {
  ui?: UIState
  storefrontStore?: StorefrontStore
}

@inject('storefrontStore', 'ui')
@observer
export class HomePage extends React.Component<IHomePage> {
  constructor(props: IHomePage) {
    super(props)
    props.ui!.setNavigationBarTitle('母婴专场')
  }

  public async componentDidMount() {
    if (!this.props.storefrontStore!.landingPage.loaded) {
      this.props.ui!.showModal({ description: '加载中...' })
      try {
        await this.props.storefrontStore!.loadLandingPage()
      } catch (err) {
        this.props.ui!.toast(`加载失败：${err}`)
      } finally  {
        this.props.ui!.hideModal()
      }
    }
  }

  public render() {
    const { storefrontStore } = this.props
    const landingPage = storefrontStore!.landingPage
    console.log(storefrontStore)
    if (landingPage.loaded) {
      return (
        <div className="home-page">
          <ComponentsList pageId="homepage" components={storefrontStore!.landingPage.parsedData.components} />
        </div>
      )
    } else if (landingPage.loading) {
      return null
    } else {
      return <b>页面走丢了</b>
    }
  }
}
