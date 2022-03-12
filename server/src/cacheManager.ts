export class cacheManager {
  static instance: cacheManager

  cache: { [key: string]: { [key: string]: any } } = {}
  cleanTime: number = -1

  constructor(cleanTime: number) {
    cacheManager.instance = this
    this.cleanTime = cleanTime
  }

  get(agent: string, key: string) {
    return this.cache[agent]?.[key]
  }
  set(agent: string, key: string, value: any) {
    if (this.cache[agent] === undefined) {
      this.cache[agent] = {}
    }

    this.cache[agent][key] = value
    if (this.cleanTime > 0) {
      setTimeout(() => {
        if (this.cache[agent]?.[key]) {
          delete this.cache[agent][key]
        }
      }, this.cleanTime)
    }
  }
  _delete(agent: string, key: string) {
    if (this.cache[agent] && this.cache[agent][key]) {
      delete this.cache[agent][key]
    }
  }
  clear() {
    this.cache = {}
  }
}
