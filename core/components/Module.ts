import { Task } from '@latitudegames/thoth-core/plugins/taskPlugin/task'
import isEqual from 'lodash/isEqual'

import { ModuleControl } from '../dataControls/ModuleControl'
import { ThothComponent } from '../thoth-component'
import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../types'

const info = `The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.`
export class ModuleComponent extends ThothComponent {
  module
  _task: Task
  updateModuleSockets: Function
  task
  info
  subscriptionMap: Record<number, { unsubscribe: () => void }> = {}
  editor: any
  noBuildUpdate: boolean
  category: string

  constructor() {
    super('Module')
    this.module = {
      nodeType: 'module',
    }
    this.task = {
      outputs: {},
      closed: [] as { [key: string]: string }[],
    }
    this.category = 'Core'
    this.info = info
    this.noBuildUpdate = true
  }

  builder(node: ThothNode) {
    const moduleControl = new ModuleControl({
      name: 'Module select',
      write: false,
    })

    if (node.data.module) {
      this.subscribe(node)
    }

    moduleControl.onData = (moduleName: string) => {
      this.updateSockets(node, moduleName)
      this.subscribe(node)
    }

    node.inspector.add(moduleControl)

    return node
  }

  destroyed(node: ThothNode) {
    this.unsubscribe(node)
  }

  unsubscribe(node: ThothNode) {
    if (!this.subscriptionMap[node.id]) return

    this.subscriptionMap[node.id].unsubscribe()
    delete this.subscriptionMap[node.id]
  }

  async subscribe(node: ThothNode) {
    if (!node.data.module) return

    let cache: string

    this.unsubscribe(node)
    this.subscriptionMap[node.id] = await this.editor.thothV2.findOneModule(
      { name: node.data.module },
      (module: { toJSON: Function; name: string }) => {
        if (cache && !isEqual(cache, module.toJSON())) {
          // make sure that the module manager has the latest updated version of the module
          this.editor.moduleManager.updateModule(module.toJSON())
          this.updateSockets(node, module.name)
        }
        cache = module.toJSON()
      }
    )
  }

  updateSockets(node: ThothNode, moduleName: string) {
    node.data.module = moduleName
    this.updateModuleSockets(node)
    this.editor.trigger('process')
    node.update()
  }

  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: { [key: string]: string },
    { module }: { module: { outputs: ThothWorkerOutputs[] } }
  ) {
    const open = Object.entries(module.outputs)
      .filter(([, value]) => typeof value === 'boolean' && value)
      .map(([key]) => key)
    // close all triggers first
    const dataOutputs = node.data.outputs as ThothWorkerOutputs[]
    this._task.closed = dataOutputs
      .map((out: { name: string }) => out.name)
      .filter((out: string) => !open.includes(out))

    return module.outputs
  }
}
