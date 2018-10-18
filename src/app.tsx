import { createBrowserHistory } from 'history'
import * as React from 'react'
import { Route, Router, Switch } from 'react-router'

import { LoadingModal } from './components/loading-modal'
import { NavbarWithRouter } from './components/navbar'
import { PrivateRoute } from './components/private-route'
import { Tab } from './components/tab'
import { Toast } from './components/toast'
import { WxAuthRoute } from './components/wxauth-route'
import { AuthApp } from './pages/auth'
import { AuthCallbackPage } from './pages/auth-callback'
import { AuthorizePage } from './pages/authorize'
import { CartPage } from './pages/cart'
import { CheckoutPage } from './pages/checkout'
import { CreateRecipient } from './pages/create-recipient/create-recipient'
import { AfterSale, AfterSaleSection, HelpCenterPage, InvoicePage, InvoiceSection, QAPage, ServicePolicyPage, ServicePolicySection, ShippingPage, ShippingSection } from './pages/help-center'
import { HomePage } from './pages/home'
import { ModifyPassword } from './pages/modify-password'
import { OrderPage } from './pages/order'
import { OrdersPage } from './pages/orders'
import { Page } from './pages/page'
import { Product } from './pages/product'
import { Products } from './pages/products'
import { RecipientPage } from './pages/recipient'
import { RecipientSearch } from './pages/recipient-search'
import { RecipientsPage } from './pages/recipients'
import { SettingsPage } from './pages/settings'
import { UserCenterPage } from './pages/user-center'
import { ui, StoreProvider } from './provider'

const history = createBrowserHistory()

export class App extends React.Component {
  constructor(props: {}) {
    super(props)
    if (ui.shouldShowNavbar) {
      document.body!.classList.add('has-navbar')
    }
  }

  public render() {
    return (
      <StoreProvider>
        <Router history={history}>
          <React.Fragment>
            {ui.shouldShowNavbar && <NavbarWithRouter />}
            <Switch>
              <Route exact path="/auth/:action" component={AuthApp} />
              <Route exact path="/auth/:provider/callback" component={AuthCallbackPage} />
              <Route exact path="/auth/:provider/authorize" component={AuthorizePage} />
              <Route exact path="/products/:id" component={Product} />
              <Route exact path="/pages/:id" component={Page} />

              <Route exact path="/help" component={HelpCenterPage} />
              <Route exact path="/help/qa" component={QAPage} />
              <Route exact path="/help/after-sale" component={AfterSale} />
              <Route exact path="/help/after-sale/:section" component={AfterSaleSection} />
              <Route exact path="/help/invoice" component={InvoicePage} />
              <Route exact path="/help/invoice/:section" component={InvoiceSection} />
              <Route exact path="/help/shipping" component={ShippingPage} />
              <Route exact path="/help/shipping/:section" component={ShippingSection} />
              <Route exact path="/help/service-policy" component={ServicePolicyPage} />
              <Route exact path="/help/service-policy/:section" component={ServicePolicySection} />

              <PrivateRoute path="/checkout">
                <WxAuthRoute component={CheckoutPage} />
              </PrivateRoute>
              <PrivateRoute path="/settings" component={SettingsPage} />
              <PrivateRoute exact path="/modify-password" component={ModifyPassword} />
              <PrivateRoute exact path="/create-recipient" component={CreateRecipient} />
              <PrivateRoute exact path="/recipients" component={RecipientsPage} />
              <PrivateRoute exact path="/search-recipient" component={RecipientSearch} />
              <PrivateRoute exact path="/orders" component={OrdersPage} />
              <PrivateRoute path="/orders/:id" component={OrderPage} />
              <PrivateRoute exact path="/recipients/:id" component={RecipientPage} />
              <Tab>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/user-center" component={UserCenterPage} />
                <Route exact path="/cart" component={CartPage} />
              </Tab>
            </Switch>

            <Toast />
            <LoadingModal />
          </React.Fragment>
        </Router>
      </StoreProvider>
    )
  }
}
