import { configure } from 'mobx'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { App } from './app'
import './styles/main.scss'

configure({ enforceActions: true })

function render(Component: React.ComponentType<any>) {
  ReactDOM.render(
    <Component />,
    document.getElementById('root'),
  )
}

render(App)

declare const module: any

if (module.hot) {
  module.hot.accept(['./app'], () => {
    render(require('./app').App)
  })
}
