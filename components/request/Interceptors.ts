/**
 * 拦截器组
 */
class Interceptors {
  private resolvers: Function[]

  constructor() {
    this.resolvers = []
  }

  use(resolver: Function) {
    if (!this.resolvers.includes(resolver)) {
      this.resolvers.push(resolver)
    }
    return resolver
  }

  eject(resolver: Function) {
    const index = this.resolvers.findIndex((item) => item === resolver)
    this.resolvers.splice(index, 1)
  }

  exec(initialValue: object) {
    return this.resolvers.reduce((pre, curr) => curr(pre), initialValue)
  }
}

export default Interceptors
