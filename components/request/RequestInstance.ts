import qs from "qs"
import Interceptors from "./Interceptors"
import RequestUrl from "./RequestUrl"

interface InstanceConfig {
  baseURL: string,
  headers: object | Headers,
  paramsSerializer: (params: object) => string,
  transformRequest: (data: any, headers: object | Headers) => any,
  transformResponse: (data: Response) => any,
}

type RequestConfig = InstanceConfig | RequestInfo

const defaultConfig: InstanceConfig = {
  baseURL: '/',
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  paramsSerializer: (params = {}) => qs.stringify(params, {
    arrayFormat: 'comma',
    allowDots: true,
    format: 'RFC1738',
    encoder: encodeURI,
  }),
  transformRequest: (data, headers: Headers | any = {}) => {
    if (headers['Content-Type']?.includes('application/json')) {
      return JSON.stringify(data)
    }
    return data
  },
  transformResponse: (data) => data.json(),
}

class RequestInstance {
  config: any
  interceptors: { request: Interceptors; response: Interceptors }

  constructor(instanceConfig: InstanceConfig) {
    // 在默认配置基础上合并实例配置
    this.config = { ...defaultConfig, ...instanceConfig }
    /**
     * 拦截器操作动作
     */
    this.interceptors = {
      request: new Interceptors(),
      response: new Interceptors(),
    }
  }

  async request(requestConfig: RequestConfig) {
    // 合并实例配置与请求配置
    let config = {
      ...this.config,
      ...(requestConfig as object),
    }
    /* 处理拦截器 */
    config = this.interceptors.request.exec(config)
    /* 组装请求地址 */
    const url = new RequestUrl(config).toString()
    /* 解析请求体 */
    const body = config.transformRequest(config.body, config.headers)
    /* 发送请求 */
    return fetch(url, {
      ...config, body,
    })
      .then((response) => {
        if (!response.ok) {
          // 不成功的请求走reject流
          return Promise.reject(response)
        }
        return response
      })
      .then(config.transformResponse)
      .catch((error) => {
        if (error instanceof Response) {
          this.interceptors.response.exec(error)
        }
        return Promise.reject(error)
      })
  }
}

export default RequestInstance
