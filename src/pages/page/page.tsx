import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router'

import { IStores } from '../../provider'
import { PageStore } from '../../store'

import { ComponentsList } from '../../components/components-list'

interface IMatchParams {
  id: string
}

interface IProductProps extends RouteComponentProps<IMatchParams> {
  pageStore?: PageStore
}

@inject((stores: IStores, props: RouteComponentProps<IMatchParams>) => ({
  pageStore: stores.resources.getPageStore(props.match.params.id),
}))
@observer
export class Page extends React.Component<IProductProps> {
  public componentDidMount() {
    this.props.pageStore!.load()
  }

  public render() {
    const { pageStore, match: { params: { id } } } = this.props
    return (
      <div className="contain">
        {!pageStore!.loading && (
          <ComponentsList pageId={id} components={pageStore!.parsedData.components} {...this.props}/>
        )}
      </div>
    )
  }
}
