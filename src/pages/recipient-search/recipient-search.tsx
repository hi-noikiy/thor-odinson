import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { UIState } from '../../store'

import { IconLoading } from '../../components/icons'
import { ThrottleInput } from '../../components/input'
import { RecipientSearchLine } from '../../components/recipient-search-line/recipient-search-line'
import { IRecipientSearch } from '../../store'

interface IRecipientSearchProps extends RouteComponentProps<{}> {
  recipientSearchStore: IRecipientSearch
  ui?: UIState
}
interface IState {
  showClear: boolean
}
@inject('recipientSearchStore', 'ui')
@observer
export class RecipientSearch extends React.Component<IRecipientSearchProps, IState> {
  constructor(props: IRecipientSearchProps) {
    super(props)
    this.state = { showClear: false }
  }
  public componentWillMount() {
    const { reset } = this.props.recipientSearchStore
    reset()
  }
  public render() {
    const { recipientSearchStore, history, ui } = this.props
    const { placeSuggestion, recipients, select, loading } = recipientSearchStore
    return (
      <div className="recipient-search-container" style={{ height: ui!.getScreenHeight(0.88, 1) }}>
        <div className="search-bar-container">
          <div className="search-bar">
            <ThrottleInput
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                placeSuggestion(e.target.value.trim())
                this.setState({ showClear: !!e.target.value.trim() })
              }}
              duration={200}
              beforeChange={e => e.persist()}
              className="search-input"
              small={true}
              leftElement={
                <div className="region"><span>北京市</span></div>
              }
              showClear={ this.state.showClear ? true : false}
              placeholder="小区/写字楼/学校等"
            />
            <button className="back" onClick={() => history.goBack()}>取消</button>
          </div>
        </div>
        {
          (loading && this.state.showClear) &&
          <div className="loading-indicator-overlay"><IconLoading className="loading-indicator-overlay-white" /></div>
        }
        {
          (!loading && !!recipients.length) &&
          <div className="search-list">
            {recipients.map((r, i) => (
              <RecipientSearchLine recipient={r} key={i} select={select} {...this.props} />
            ))}
          </div>
        }
        {(!loading && !recipients.length && this.state.showClear) &&
          <div className="search-no-result">
            <img src={require('../../public/images/map-marker-alt.svg')} />
            <span className="no-result-text">未匹配到结果</span>
            <span>请输入小区/写字楼/学校等</span>
          </div>
        }
      </div>
    )
  }
}
