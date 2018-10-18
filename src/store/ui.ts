import { action, computed, observable, runInAction } from 'mobx'

import { inAndroidWebview, inShansong, inWechat } from '../utils'

export interface INavigationBarOptions {
  title: string
  foregroundColor: string
  backgroundColor: string
  hidden: boolean
}

export class UIState {

  @observable public isLoading = false
  @observable public toastText?: string
  @observable public modal: IModalParams = {
    isOpen: false,
    description: '',
  }
  @observable public navigationBarOptions: INavigationBarOptions = {
    title: '',
    foregroundColor: '#000',
    backgroundColor: '#fff',
    hidden: false,
  }

  @computed get navbarVisible() {
    return !this.navigationBarOptions.hidden
  }

  @computed get shouldShowNavbar() {
    if (inWechat() || inShansong() || inAndroidWebview()) {
      return false
    }
    return true
  }

  private toastTimer?: NodeJS.Timer

  @action public showModal(params?: IModalParams) {
    this.modal = { ...params, isOpen: true }
  }

  @action public hideModal() {
    this.modal = { isOpen: false }
  }

  @action public showNavbar() {
    this.navigationBarOptions.hidden = false
  }

  @action public hideNavbar() {
    this.navigationBarOptions.hidden = true
  }

  @action public setNavigationBarTitle(title: string) {
    this.navigationBarOptions.title = title
  }

  @action public setNavigationBarForegroundColor(color: string) {
    this.navigationBarOptions.foregroundColor = color
  }

  @action public setNavigationBarBackgroundColor(color: string) {
    this.navigationBarOptions.backgroundColor = color
  }

  @action public setNavigationBar(options: INavigationBarOptions) {
    this.navigationBarOptions = options
  }

  @action public updateNavigationBar(options: Partial<INavigationBarOptions>) {
    this.navigationBarOptions = { ...this.navigationBarOptions, ...options }
  }

  @action public toast(text: string) {
    this.toastText = text
    this.restartToastTimer()
  }

  @action public calRemToPixel(...occupies: number[]): number {
    const r: number = parseFloat((document.documentElement!.clientWidth / 750 * 100).toFixed(3))
    return r * occupies.reduce((a, c) => a + c, 0)
  }

  // @params occupies unit of rem
  @action public getScreenHeight(...occupies: number[]): number {
    return window.screen.availHeight - this.calRemToPixel(...occupies)
  }

  @action private restartToastTimer() {
    if (this.toastTimer) {
      clearTimeout(this.toastTimer)
    }
    this.toastTimer = setTimeout(() => {
      runInAction(() => {
        this.toastText = undefined
      })
    }, 2000)
  }
}

export interface IModalParams {
  isOpen?: boolean
  description?: string
}

export interface IToastParams {

}

export interface IUIStateProps {
  ui?: UIState
}
