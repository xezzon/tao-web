import qs from 'qs'

interface RequestUrlProps {
  url: string,
  baseURL: string,
  params: object,
  paramsSerializer: Function,
}

class RequestUrl implements RequestUrlProps {
  url: string
  baseURL: string
  params: object
  paramsSerializer: Function

  /**
   * @param {object} config
   * @param {string} config.url
   * @param {string} config.baseURL
   * @param {object} config.params
   * @param {Function} config.paramsSerializer
   */
  constructor({
    url, baseURL, params, paramsSerializer,
  }: RequestUrlProps) {
    this.url = url
    this.baseURL = baseURL
    this.params = params
    this.paramsSerializer = paramsSerializer
  }

  /**
   * 是否绝对路径
   */
  isAbsolute(): boolean {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(this.url)
  }

  get path() {
    const path = this.isAbsolute()
      ? this.url
      : `${this.baseURL.replace(/\/+$/, '')}/${this.url.replace(/^\/+/, '')}`
    return path.split('?')[0]
  }

  get queryString() {
    const queryParams = this.url.split('?').slice(1).join('?')
    return this.paramsSerializer({
      ...qs.parse(queryParams),
      ...this.params,
    })
  }

  toString() {
    return `${this.path}?${this.queryString}`
  }
}

export default RequestUrl
