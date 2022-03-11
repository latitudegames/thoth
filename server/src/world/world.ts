import { randomInt } from '@latitudegames/thoth-core/src/connectors/utils'
import { database } from '@latitudegames/thoth-core/src/connectors/database'
import agent from './agent'
import gameObject from './gameObject'
import time from './time'
import { initAgentsLoop } from './agentsLoop'
import { xrEngineAgent } from './xrEngineAgent'

export class world extends gameObject {
  static instance: world
  id = -1
  objects: { [id: number]: any } = {}
  oldAgents: any
  newAgents: any
  _xrEngineAgent: xrEngineAgent

  constructor() {
    super(0)
    console.log('creating world')
    world.instance = this
    new time()
    this.onCreate()

    if (process.env.CREATE_XR_ENGINE_AGENT === 'true') {
      this._xrEngineAgent = new xrEngineAgent(
        process.env.XR_ENGINE_URL as string
      )
    }
  }

  async updateObjects() {
    this.newAgents = await database.instance.getAgentInstances()
    const newAgents = this.newAgents
    delete newAgents['updated_at']
    const oldAgents = this.oldAgents ?? []
    if (oldAgents['updated_at']) delete oldAgents['updated_at']
    if (JSON.stringify(newAgents) === JSON.stringify(oldAgents)) return // They are the same

    // If an entry exists in oldAgents but not in newAgents, it has been deleted
    for (const i in oldAgents) {
      // filter for entries where oldAgents where id === newAgents[i].id
      if (
        newAgents.filter((x: any) => x.id === oldAgents[i].id)[0] === undefined
      ) {
        await this.removeObject(oldAgents[i].id)
        console.log('removed ', oldAgents[i].id)
      }
    }

    // If an entry exists in newAgents but not in oldAgents, it has been added
    for (const i in newAgents) {
      // filter for entries where oldAgents where id === newAgents[i].id
      if (
        oldAgents.filter((x: any) => x.id === newAgents[i].id)[0] === undefined
      ) {
        if (newAgents[i].enabled) {
          await this.addObject(new agent(newAgents[i]))
        }
      }
    }

    for (const i in newAgents) {
      if (newAgents[i].dirty) {
        await this.removeObject(newAgents[i].id)
        await this.addObject(new agent(newAgents[i]))
        await database.instance.setInstanceDirtyFlag(newAgents[i].id, false)
      }
    }

    // ODYzNTQ1NjczNTkyNjAyNjU1.YOodlA.Z4sa1z_vnal3LKQ9PYwJ5fzlbzI

    this.oldAgents = this.newAgents
  }

  async onCreate() {
    super.onCreate()

    initAgentsLoop(
      async (id: number) => {
        await this.updateObjects()
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
    console.log('adding object', obj.id)
    if (this.objects[obj.id] === undefined) {
      this.objects[obj.id] = obj
    } else {
      throw new Error('Object already exists')
    }
  }

  async removeObject(id: number) {
    if (this.objectExists(id)) {
      await (this.objects[id] as gameObject)?.onDestroy()
      this.objects[id] = null
      delete this.objects[id]
      console.log('Removed ', id)
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
