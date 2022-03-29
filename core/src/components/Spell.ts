import isEqual from 'lodash/isEqual'

import {
  ModuleType,
  ModuleWorkerOutput,
  NodeData,
  ThothNode,
  ThothWorkerInputs,
} from '../../types'
import { SpellControl } from '../dataControls/SpellControl'
import { Task } from '../plugins/taskPlugin/task'
import { ThothComponent } from '../thoth-component'

const info = `The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.`

export class SpellComponent extends ThothComponent<ModuleWorkerOutput[]> {
  _task: Task
  updateModuleSockets: Function
  task
  info
  subscriptionMap: Record<number, Function> = {}
  editor: any
  noBuildUpdate: boolean
  category: string

  constructor() {
    super('Spell')
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
    const moduleControl = new SpellControl({
      name: 'Spell Select',
    })

    moduleControl.onData = (moduleName: string) => {
      this.updateSockets(node, moduleName)
    }

    node.inspector.add(moduleControl)

    return node
  }
  async subscribe(node: ThothNode) {
    if (!node.data.module) return
    let cache: ModuleType

    // this.unsubscribe(node)

    this.subscriptionMap[node.id] = this.editor.thoth.onModuleUpdated(
      node.data.module,
      (module: ModuleType) => {
        if (!isEqual(cache, module)) {
          this.editor.moduleManager.updateModule(module)
          this.updateSockets(node, module.name)
        }
        cache = module
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
    { module }: { module: { outputs: ModuleWorkerOutput[] } }
  ) {
    const open = Object.entries(module.outputs)
      .filter(([, value]) => typeof value === 'boolean' && value)
      .map(([key]) => key)
    // close all triggers first
    const dataOutputs = node.data.outputs as ModuleWorkerOutput[]
    this._task.closed = dataOutputs
      .map((out: { name: string }) => out.name)
      .filter((out: string) => !open.includes(out))

    return module.outputs
  }
}
