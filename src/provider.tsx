import { AccountClient } from '@xrc-inc/buy-sdk/ecnova/api/account/v1/account_proto/account_pb_service'

import { BaiduLBSClient } from '@xrc-inc/buy-sdk/ecnova/api/baidulbs/v1/baidulbs_proto/baidulbs_pb_service'

import { OAuth2ConnectClient } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/oauth2connect/v1/oauth2connect_proto/oauth2connect_pb_service'
import { SMSAuthConnectClient } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/smsauthconnect/v1/smsauthconnect_proto/smsauthconnect_pb_service'
import { AuthClient } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/v1/authconnect_proto/authconnect_pb_service'
import { WXAuthConnectClient } from '@xrc-inc/buy-sdk/ecnova/api/authconnect/wxauthconnect/v1/wxauthconnect_proto/wxauthconnect_pb_service'
import { BuyServiceClient } from '@xrc-inc/buy-sdk/ecnova/api/marketplace/buy/v1/buy_proto/buy_pb_service'
import { ShansongClient } from '@xrc-inc/buy-sdk/ecnova/api/shansong/v1/shansong_proto/shansong_pb_service'

import axios from 'axios-jsonp-pro'
import { observable } from 'mobx'
import { Provider } from 'mobx-react'
import * as React from 'react'

import { env } from './env'
import { AccountStore, GithubOAuth2Store, IStorage, SMSAuthStore } from './store/auth'
import { AuthConnStore } from './store/auth/authconn-store'
import { WxAuth } from './store/auth/wx-auth'
import { CartLineItemAddStore } from './store/cart-line-item-add'
import { CheckoutStore } from './store/checkout'
import { CollectionStore } from './store/collection'
import { LBSClient } from './store/lbs'
import { OrderStore } from './store/order'
import { OrdersStore } from './store/orders'
import { PageStore } from './store/page'
import { PageComponentStore } from './store/page-component'
import { ProductStore } from './store/product'
import { ProductProviderStore } from './store/product-provider'
import { ProductsStore } from './store/products'
import { ProfileStore } from './store/profile'
import { RecipientStore } from './store/recipient'
import { RecipientSearchStore } from './store/recipient-search'
import { IRecipientsStore, RecipientsStore } from './store/recipients'
import { ShoppingCartStore } from './store/shopping-cart'
import { StorefrontStore } from './store/storefront'
import { UIState } from './store/ui'

const storage: IStorage = {
  load: async key => localStorage.getItem(key),
  save: (key: string, value: string) => localStorage.setItem(key, value),
  delete: async key => localStorage.removeItem(key),
}

const oauth2Cli = new OAuth2ConnectClient(env.authConnEndpoint!)
const githubAuth = new GithubOAuth2Store(oauth2Cli, env.oauth2Conn!, storage)
const authCli = new AuthClient(env.authConnEndpoint!)
const authConnStore = new AuthConnStore(authCli, storage)
const wxAuthCli = new WXAuthConnectClient(env.authConnEndpoint!)
const wxAuth = new WxAuth(wxAuthCli, authCli, env.wxAuthId!, storage)
const accountCli = new AccountClient(env.accountEndpoint!)
const accountStore = new AccountStore(accountCli, storage)
const smsAuthClient = new SMSAuthConnectClient(env.authConnEndpoint!)
const smsAuthStore = new SMSAuthStore(smsAuthClient, env.smsAuthConn!)
const buyCli = new BuyServiceClient(env.marketplaceEndpoint!)
const ssCli = new ShansongClient(env.ssEndpoint!)
// @todo
const lbs = env.lbs as any
const mapCli = new LBSClient({ uri: lbs.uri, token: lbs.token }, axios)
const baidulbs = env.baidulbsEndpoint as any
const mapBaiduCli = new BaiduLBSClient(baidulbs)
const storefrontStore = new StorefrontStore(buyCli, env.publicId!)
const productsStore = new ProductsStore(buyCli, storefrontStore)
const profileStore = new ProfileStore(buyCli, storefrontStore, accountStore)
const shoppingCartStore = new ShoppingCartStore(buyCli, storefrontStore, accountStore, mapCli)
const cartLineItemAddStore = new CartLineItemAddStore(shoppingCartStore, storefrontStore)
const recipientsStore = new RecipientsStore(buyCli, storefrontStore, accountStore, profileStore)
const recipientStore = new RecipientStore(buyCli, storefrontStore, accountStore, profileStore)
const checkoutStore = new CheckoutStore(buyCli, storefrontStore, accountStore, mapCli)
const recipientSearchStore = new RecipientSearchStore(mapBaiduCli, accountStore, recipientStore)
export const ui = new UIState()
const ordersStore = new OrdersStore(buyCli, ssCli, mapCli, ui, accountStore, storefrontStore)

export class StoreProvider extends React.Component {
  private resourceStore = observable<{ [name: string]: any }>({
    orders: {},
    pageComponents: {},
    pages: {},
    products: {},
    collections: {},
    cartLineItemAdd: null,
    productProviders: {},
    getOrderStore(id: string): OrderStore {
      let store = this.orders[id]
      if (!store) {
        store = new OrderStore(buyCli, storefrontStore, accountStore, ssCli, id)
        this.orders[id] = store
      }
      return store
    },
    getPageStore(id: string): PageStore {
      let store = this.pages[id]
      if (!store) {
        store = new PageStore(buyCli, storefrontStore, id)
        this.pages[id] = store
      }
      return store
    },
    getProductStore(id: string): ProductStore {
      let store = this.products[id]
      if (!store) {
        store = new ProductStore(buyCli, storefrontStore, id)
        this.products[id] = store
      }
      return store
    },
    getProductProviderStore(id: string, options: any): ProductProviderStore {
      let store = this.productProviders[id]
      let collectionStore = null
      let productIdsList: string[] = []
      if (options.collection) {
        collectionStore = this.getCollectionStore(options.collection.id)
      }
      if (options.products) {
        productIdsList = options.products.idsList
      }
      if (!store) {
        store = new ProductProviderStore(buyCli, storefrontStore, { collectionStore, productIdsList })
        this.productProviders[id] = store
      }
      return store
    },
    getCollectionStore(id: string): CollectionStore {
      let store = this.collections[id]
      if (!store) {
        store = new CollectionStore(buyCli, storefrontStore, id)
        this.collections[id] = store
      }
      return store
    },
    getPageComponentStore(id: string): PageComponentStore {
      let store = this.pageComponents[id]
      if (!store) {
        store = new PageComponentStore(buyCli, storefrontStore, id)
        this.pageComponents[id] = store
      }
      return store
    },
  })

  public render() {
    return (
      <Provider
        accountStore={accountStore}
        authConnStore={authConnStore}
        cartLineItemAddStore={cartLineItemAddStore}
        checkoutStore={checkoutStore}
        productsStore={productsStore}
        recipientsStore={recipientsStore}
        recipientStore={recipientStore}
        profileStore={profileStore}
        resources={this.resourceStore}
        shoppingCartStore={shoppingCartStore}
        smsAuthStore={smsAuthStore}
        storefrontStore={storefrontStore}
        ui={ui}
        githubAuth={githubAuth}
        recipientSearchStore={recipientSearchStore}
        ordersStore={ordersStore}
        wxAuth={wxAuth}
      >
        {this.props.children}
      </Provider>
    )
  }
}

export interface IStores {
  accountStore: AccountStore
  authConnStore: AuthConnStore
  cartLineItemAddStore: CartLineItemAddStore
  checkoutStore: CheckoutStore
  productsStore: ProductsStore
  profileStore: ProfileStore
  recipientsStore: RecipientsStore
  shoppingCartStore: ShoppingCartStore
  smsAuthStore: SMSAuthStore
  storefrontStore: StorefrontStore
  ui: UIState
  githubAuth: GithubOAuth2Store
  ordersStore: OrdersStore
  wxAuth: WxAuth
  resources: {
    getOrderStore(id: string): OrderStore,
    getPageStore(id: string): PageStore,
    getProductStore(id: string): ProductStore,
    getCollectionStore(id: string): CollectionStore,
    getPageComponentStore(id: string): PageComponentStore,
    getProductProviderStore(id: string, options: any): ProductProviderStore,
  }
}
