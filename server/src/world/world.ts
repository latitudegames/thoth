import { randomInt } from '@latitudegames/thoth-core/src/superreality/utils'
import { database } from '@latitudegames/thoth-core/src/superreality/database'
import agent from './agent'
import gameObject from './gameObject'
import time from './time'
import { initAgentsLoop } from './agentsLoop'

export class world extends gameObject {
  static instance: world
  id = -1
  objects: { [id: number]: any } = {}

  constructor() {
    super(0)
    console.log('creating world')
    world.instance = this
    new time()
    this.onCreate()
  }

  async onCreate() {
    super.onCreate()
    const agents = await database.instance.getAgentInstances()

    for (let i = 0; i < agents.length; i++) {
      if (agents[i]._enabled) {
        const _agent = new agent(
          agents[i].id,
          agents[i].personality,
          JSON.parse(agents[i].clients)
        )
        this.objects[i] = _agent
      }
    }

    initAgentsLoop(
      async (id: number) => {
        this.updateInstance(id)
      },
      async (id: number) => {
        this.lateUpdateInstance(id)
      }
    )
  }

  async updateInstance(id: number) {
    for (const i in this.objects) {
      if (this.objects[i].id === id) {
        await (this.objects[i] as gameObject).onUpdate()
        return
      }
    }
  }
  async lateUpdateInstance(id: number) {
    for (const i in this.objects) {
      if (this.objects[i].id === id) {
        await (this.objects[i] as gameObject)?.onLateUpdate()
        return
      }
    }
  }

  async onDestroy() {
    super.onDestroy()
  }

  async onUpdate() {
    super.onUpdate()
    for (let i in this.objects) {
      await (this.objects[i] as gameObject).onUpdate()
    }
  }

  async onLateUpdate() {
    super.onUpdate()
    for (let i in this.objects) {
      await (this.objects[i] as gameObject)?.onLateUpdate()
    }
  }

  async addObject(obj: gameObject) {
    let id = randomInt(0, 10000)
    while (this.objectExists(id)) {
      id = randomInt(0, 10000)
    }

    this.objects[id] = obj
    await obj.onCreate()
    return id
  }
  async removeObject(id: number) {
    if (this.objectExists(id)) {
      await (this.objects[id] as gameObject)?.onDestroy()
      delete this.objects[id]
    }
  }
  getObject(id: number) {
    return this.objects[id]
  }
  objectExists(id: number) {
    return this.objects[id] !== undefined && this.objects[id] === null
  }
  generateId(): number {
    let id = randomInt(0, 10000)
    while (this.objectExists(id)) {
      id = randomInt(0, 10000)
    }
    return id
  }
}
