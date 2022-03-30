import axios from 'axios'
//@ts-ignore
import similarity from 'similarity'

export class cacheManager {
  static instance: cacheManager

  cache: { [key: string]: { [key: string]: any } } = {}
  cleanTime: number = -1

  constructor(cleanTime: number) {
    cacheManager.instance = this
    this.cleanTime = cleanTime
  }

  async get(agent: string, key: string) {
    if (
      !this.cache[agent] ||
      this.cache[agent] === undefined ||
      this.cache[agent]?.length <= 0
    ) {
      return undefined
    }

    let res = this.cache[agent]?.[key]
    if (!res || res === undefined) {
      for (var x in this.cache[agent]) {
        if (similarity(x, key, { sensitive: false }) > 0.7) {
          res = this.cache[agent]?.[x]
          break
        }
      }
    }

    if (!res || res === undefined) {
      const docs: string[] = []
      for (var x in this.cache[agent]) {
        docs.push(this.cache[agent][x])
      }

      if (docs.length > 0) {
        const response = await axios.post(
          `https://api.openai.com/v1/engines/ada/search`,
          { documents: docs, query: key },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + process.env.OPENAI_API_KEY,
            },
          }
        )

        let highestScore = -1
        let highestIndex = -1

        for (let i = 0; i < response.data.data.length; i++) {
          const score = response.data.data[i].score
          if (score > highestScore) {
            highestScore = score
            highestIndex = i
          }
        }

        if (highestIndex !== -1 && highestScore >= 200) {
          res = docs[response.data.data[highestIndex].document]
        }
      }
    }

    return res
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
