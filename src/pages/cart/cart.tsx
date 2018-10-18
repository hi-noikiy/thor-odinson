import classNames from 'classnames'
import { inject, observer } from 'mobx-react'
import * as React from 'react'
import { Portal } from 'react-portal'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'

import { Button } from '../../components/button'
import { CartLine } from '../../components/cart-line'
import { Checkbox } from '../../components/checkbox'
import { EmptyState } from '../../components/empty-state'
import { IStores } from '../../provider'
import { ShoppingCartStore, UIState } from '../../store'
import { ICartItemLine } from '../../store/cart-line-item'

interface ICartPageProps extends RouteComponentProps<{}> {
  ui?: UIState
  shoppingCartStore?: ShoppingCartStore
  authenticated: boolean
}
interface IState {
  editing: boolean
}

@inject((stores: IStores) => ({
  ui: stores.ui,
  shoppingCartStore: stores.shoppingCartStore,
  authenticated: stores.accountStore.authenticated,
}))
@observer
export class CartPage extends React.Component<ICartPageProps, IState>  {
  public state: IState = {
    editing: false,
  }

  constructor(props: ICartPageProps) {
    super(props)
    props.ui!.setNavigationBarTitle('购物车')
  }

  public async componentDidMount() {
    const { authenticated, shoppingCartStore: store } = this.props
    if (authenticated) {
      this.load()
    }
    if (store!.lineItems.length) {
      document.body.classList.add('has-checkout-bar')
    } else {
      document.body.classList.remove('has-checkout-bar')
    }
  }

  public componentDidUpdate(prevProps: ICartPageProps) {
    const { authenticated, shoppingCartStore: store } = this.props
    if (!prevProps.authenticated && authenticated) {
      this.load()
    }
    if (store!.lineItems.length) {
      document.body.classList.add('has-checkout-bar')
    } else {
      document.body.classList.remove('has-checkout-bar')
    }
  }

  public componentWillUnmount() {
    this.props.ui!.hideModal()
    document.body.classList.remove('has-checkout-bar')
  }

  public render() {
    const { editing } = this.state
    const { ui, shoppingCartStore: store, authenticated, location } = this.props
    if (store!.loading) {
      return null
    }
    if (!store!.lineItems.length) {
      return (
        <div className="cart-page empty" style={{ height: document.documentElement!.clientHeight - ui!.calRemToPixel(1, .88) }}>
          <div className="empty-bg-container">
            <EmptyState
              icon={
                <img
                  className="img-empty-cart"
                  src={require('../../public/images/empty-cart.svg')}
                />
              }
              title="购物车还是空的"
              action={
                authenticated ? undefined : (
                  <Link to={{ pathname: '/auth/signin', state: { from: location } }} className="block btn-goto-login">
                    <Button text="去登录" />
                  </Link>
                )
              }
            />
          </div>
        </div>
      )
    }
    return (
      <div className="cart-page">
        <div className="top-actions">
          <button onClick={() => this.setState({ editing: !editing })}>
            {editing ? '完成' : '编辑'}
          </button>
          {!authenticated && (
            <div className="login-badge">
              <img src={require('../../public/images/login-badge.svg')} />
              <Link to={{ pathname: '/auth/signin', state: { from: location } }}>立即登录</Link>
            </div>
          )}
        </div>
        <LineItemsList lineItems={store!.lineItems} />
        {this.renderCheckoutBar()}
      </div>
    )
  }

  private renderCheckoutBar() {
    const { editing } = this.state
    const { ui, shoppingCartStore: store } = this.props
    return (
      <Portal>
        <div className="checkout-bar">
          <div className="summary">
            <Checkbox
              checked={store!.allSelected}
              label={editing ? '全选' : `已选（${store!.totalNumber}）`}
              onChange={async checked => {
                if (!store!.lineItems.length) {
                  return
                }
                ui!.showModal()
                if (checked) {
                  await store!.selectAll()
                } else {
                  await store!.unselectAll()
                }
                ui!.hideModal()
              }}
            />
            <span className="flex-1" />
            {!editing && store!.totalNumber > 0
              ? <span className="total">￥{store!.grandTotal}</span>
              : null
            }
          </div>
          <button
            className={classNames('btn-checkout', {
              'btn-red': editing,
            })}
            disabled={store!.totalNumber <= 0}
            onClick={async () => {
              if (editing) {
                await store!.removeSKUs()
              } else {
                this.props.history.push('/checkout')
              }
            }}
            children={editing ? '删除' : '结账'}
          />
        </div>
      </Portal>
    )
  }

  private handleCheckout = () => {
    // TODO:
    this.props.history.push('/checkout')
  }

  private async load() {
    const { ui, shoppingCartStore, authenticated } = this.props
    ui!.showModal({ description: '加载中...' })
    try {
      await shoppingCartStore!.load()
    } catch (error) {
      console.warn(error)
      ui!.toast(error.message)
    } finally {
      ui!.hideModal()
    }
  }
}

@observer
class LineItemsList extends React.Component<{ lineItems: ICartItemLine[] }> {
  public render() {
    const { lineItems } = this.props
    return (
      <div className="shoppingcart-lineitems-list">
        {lineItems.map(line => {
          return (
            <CartLine
              key={line.getSkuId()}
              lineItem={line}
            />
          )
        })}
      </div>
    )
  }
}
