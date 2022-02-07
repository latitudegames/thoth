import { randomInt } from '@latitudegames/thoth-core/src/superreality/utils'

export class gameObject {
  id = -1
  coroutines: { [id: number]: any } = {}

  constructor(id: any) {
    this.id = id
  }

  async onCreate() {}

  async onDestroy() {}

  async onUpdate() {
    for (let i in this.coroutines) {
      await this.coroutines[i].next()
    }
  }

  async onLateUpdate() {}

  startCoroutine(func: Function) {
    let id = randomInt(0, 10000)
    while (this.coroutineExists(id)) {
      id = randomInt(0, 10000)
    }

    this.coroutines[id] = func
    return id
  }
  stopCoroutine(id: number) {
    if (this.coroutineExists(id)) {
      delete this.coroutines[id]
    }
  }
  clearCoroutines() {
    this.coroutines = {}
  }
  coroutineExists(id: number) {
    return this.coroutines[id] !== undefined && this.coroutines[id] === null
  }
}

export default gameObject
