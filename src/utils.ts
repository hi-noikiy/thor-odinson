import { Money } from '@xrc-inc/buy-sdk/google/type/money_pb'

export const parseMoneyToFloat = (money?: Money): number => {
  if (!money) {
    return 0.00
  }
  return money.getUnits() + money.getNanos() / 1e9
}

export const fullStorefrontName = (publicId: string): string => {
  return `storefronts/${publicId}`
}

export function getProductIdFromName(name: string): string {
  const p = name.split('/')
  return p[p.length - 1]
}

type AnyFunction = (...args: any[]) => any

export const curry = <T>(fn: AnyFunction, ctx: any = null) => (...args: any[]) => {
  return new Promise<T>((resovle, reject) => {
    fn.apply(ctx, args.slice(0, args.length).concat([(err: Error, data: T) => {
      if (err) {
        return reject(err)
      }
      return resovle(data)
    }]))
  })
}

export function throttle<P>(fn: (...fa: P[]) => any, duration: number, self: any = null): (...oa: P[]) => any {
  let lo: any = null
  let ct: any = null
  function throttled(...args: P[]) {
    if (!lo) {
      lo = Date.now()
    }
    if (Date.now() - lo < duration) {
      if (ct) {
        clearTimeout(ct)
      }
    }
    ct = setTimeout(() => {
      fn.apply(self, args)
      clearTimeout(ct)
    }, duration)
    lo = Date.now()
  }
  return throttled
}

export type RpcCallback<Error, Response> = (err: Error, resp: Response | null) => any

export type PromisifyFunc<Error, Response> = (
  cb: RpcCallback<Error, Response>,
) => any

/**
 * promisify 函数用来将默认的 sdk 调用封装为 promise 形式的调用方式
 * - Response 类型是 API 的返回类型
 * - Error 是 API 所在服务的错误类型，可以从具体的 pb_service 文件中 import
 */
export function promisify<Response, Error>(
  func: PromisifyFunc<Error, Response>,
) {
  return new Promise<Response>((resolve, reject) => {
    func((err: Error, resp: Response | null) => {
      err ? reject(err) : resolve(resp!)
    })
  })
}

const ua = navigator.userAgent

export function inWechat(): boolean {
  return /micromessenger/i.test(ua)
}
export function inShansong(): boolean {
  return /\/shansongclient$/.test(ua)
}
export function inIosSafari(): boolean {
  // https://developer.chrome.com/multidevice/user-agent#chrome_for_ios_user_agent
  return /(iPad|iPhone)/i.test(ua) && !/CriOS/.test(ua)
}
export function inAndroidWebview(): boolean {
  // https://developer.chrome.com/multidevice/user-agent#webview_user_agent
  return /\(Linux;\sAndroid\s.+;.+\sChrome\/.+Mobile/.test(ua)
}

const pingppLib = require('./pingpp.js')

export const pingpp = {
  createPayment: (cred: any) => {
    return new Promise((resolve, reject) => {
      pingppLib.createPayment(cred, (result: string, err: { msg: string, extra: string }) => {
        if (result === 'success') {
          resolve(true)
          // 只有微信公众号 (wx_pub)、微信小程序（wx_lite）、QQ 公众号 (qpay_pub)支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL
        } else if (result === 'fail') {
          const error = new Error(err.msg);
          (error as any).extra = err.extra
          reject(error)
          // Ping++ 对象 object 不正确或者微信公众号/微信小程序/QQ公众号支付失败时会在此处返回
        } else if (result === 'cancel') {
          // 微信公众号、微信小程序、QQ 公众号支付取消支付
          resolve(false)
        }
      })
    })
  },
}
