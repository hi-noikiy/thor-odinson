import URI from 'urijs'

export interface ILocation {
  lat: number,
  lng: number,
}

export interface IPOI {
  name: string
  location: ILocation
  uid: string
  tag: string
  address: string
  showName: string
}

export interface IURI {
  protocal: string,
  host: string,
}
export interface ILBSConf {
  uri: IURI
  token: string
}

export interface ILBSClient {
  base: any
  pro: Promise<LBSClient> | null
  token: string

  ready(): Promise<ILBSClient>
  web(): ILBSClientWeb
  api(): any
}

export class LBSClient implements ILBSClient {
  public base: any
  public pro: Promise<LBSClient> | null
  public token: string
  private iapi: any
  private iweb: LBSClientWeb

  constructor(conf: ILBSConf, agent: any) {
    this.pro = null
    this.token = conf.token
    this.base = conf.uri
    this.iweb = new LBSClientWeb(this.base, agent, conf.token)
  }

  public async ready(): Promise<ILBSClient> {
    if (!this.pro) {
      this.pro = new Promise<LBSClient>(resolve => {
        const self = this
        const gl = global as any
        gl.bmap_initialize = () => {
          self.iapi = gl.BMap
          self.iapi.utils = new LBSClientUtils(self.iapi)
          resolve(self)
        }
        const script = document.createElement('script')
        const url = new URI(this.base)
        url.addQuery('ak', this.token)
        url.addQuery('callback', 'bmap_initialize')
        url.path('api')
        script.src = url.readable()
        document.body.appendChild(script)
      })
    }
    return this.pro
  }

  public async api() {
    await this.ready()
    return this.iapi
  }

  public web() {
    return this.iweb
  }
}

interface ILBSClientWeb {
  agent: any
  base: any
  token: string
  placeSuggestion(request: IPlaceSuggestionRequest): Promise<IPlaceSuggestionResponse[]>
}

interface IAgent {
  get(...args: any[]): Promise<any>
  post(): Promise<any>
}

export interface IPlaceSuggestionRequest {
  query: string
  region: string
  ak?: string
  sn?: string
  timestamp?: number
  cityLimit?: boolean
  location?: ILocation
  coordType?: 1 | 2 | 3 | 4
  retCoordtype?: string
  output?: 'xml' | 'json'
}

export interface IPlaceSuggestionResponse {
  name?: string
  location?: ILocation
  uid?: string
  province?: string
  city?: string
  district?: string
  tag?: string
  address?: string
  children?: IPOI[]
}

class LBSClientWeb implements ILBSClientWeb {
  public static SUGGESTION_PATH: string = 'place/v2/suggestion'
  public agent: IAgent
  public base: any
  public token: string

  constructor(base: any, agent: IAgent, token: string) {
    this.base = new URI(base)
    this.agent = agent
    this.token = token
  }

  public async placeSuggestion(req: IPlaceSuggestionRequest): Promise<IPlaceSuggestionResponse[]> {
    req.ak = this.token
    req.timestamp = Date.now()
    req.output = 'json'
    const uri = this.base.path(LBSClientWeb.SUGGESTION_PATH)
    uri.query(URI.buildQuery(req))
    let res: any = null
    try {
      res = await this.request<IPlaceSuggestionResponse>(uri.readable())
      if (res.status !== 0) {
        throw new Error('获取地址错误')
      }
      res = res.result as IPlaceSuggestionResponse[]
    } catch (e) {
      console.error('Failed to exec suggestion, on lbs web api.')
      throw e
    }
    return res
  }

  private async request<K>(url: string): Promise<K> {
    const agent = this.agent as any
    return await agent.jsonp(url)
  }
}

class LBSClientUtils {
  private iapi: any
  private EARTHRADIUS: number = 6370996.81

  constructor(iapi: any) {
    this.iapi = iapi
  }

  public getDistance = (lng1: any, lat1: any, lng2: any ,lat2: any) => {
    const point1 = new this.iapi.Point(parseFloat(lng1) ,parseFloat(lat1))
    const point2 = new this.iapi.Point(parseFloat(lng2) ,parseFloat(lat2))
    point1.lng = this.getLoop(point1.lng, -180, 180)
    point1.lat = this.getRange(point1.lat, -74, 74)
    point2.lng = this.getLoop(point2.lng, -180, 180)
    point2.lat = this.getRange(point2.lat, -74, 74)
    const x1 = this.degreeToRad(point1.lng)
    const y1 = this.degreeToRad(point1.lat)
    const x2 = this.degreeToRad(point2.lng)
    const y2 = this.degreeToRad(point2.lat)
    return this.EARTHRADIUS * Math.acos((Math.sin(y1) * Math.sin(y2) + Math.cos(y1) * Math.cos(y2) * Math.cos(x2 - x1)))
  }

  private getLoop = (v: number, a: number, b: number) => {
    while(v > b){
      v -= b - a
    }
    while(v < a){
      v += b - a
    }
    return v
  }

  private getRange = (v: number, a: number, b: number) => {
    if(a !== null){
      v = Math.max(v, a)
    }
    if(b !== null){
      v = Math.min(v, b)
    }
    return v
  }
  private degreeToRad = (degree: number) => Math.PI * degree/180
}
