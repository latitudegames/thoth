import {
  ModuleWorkerOutput,
  NodeData,
  Spell,
  ThothNode,
  ThothWorkerInputs,
} from '../../types'
import { SpellControl } from '../dataControls/SpellControl'
import { EngineContext } from '../engine'
import { Task } from '../plugins/taskPlugin/task'
import { ThothComponent } from '../thoth-component'
import { inputNameFromSocketKey } from '../utils/nodeHelpers'

const info = `The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.`

export class SpellComponent extends ThothComponent<
  Promise<ModuleWorkerOutput[]>
> {
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
      skip: true,
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
    const spellControl = new SpellControl({
      name: 'Spell Select',
      write: false,
    })

    spellControl.onData = (spell: Spell) => {
      node.data.spellId = spell.name
      this.updateSockets(node, spell)
    }

    node.inspector.add(spellControl)

    return node
  }

  updateSockets(node: ThothNode, spell: Spell) {
    const chain = JSON.parse(JSON.stringify(spell.chain))
    this.updateModuleSockets(node, chain)
    this.editor.trigger('process')
    node.update()
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: { [key: string]: string },
    {
      module,
      thoth,
    }: { module: { outputs: ModuleWorkerOutput[] }; thoth: EngineContext }
  ) {
    if (module) {
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

    const flattenedInputs = Object.entries(inputs).reduce(
      (acc, [key, value]) => {
        const name = inputNameFromSocketKey(node, key)
        if (!name) return acc

        acc[name] = value[0]
        return acc
      },
      {} as Record<string, any>
    )

    const response = await thoth.runSpell(flattenedInputs, node.data.spellId)

  }
}
