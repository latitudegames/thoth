import {
  ModuleWorkerOutput,
  NodeData,
  Spell,
  ThothNode,
  ThothWorkerInputs,
} from '../../types'
import { SpellControl } from '../dataControls/SpellControl'
import { ThothEditor } from '../editor'
import { EngineContext } from '../engine'
import { Task } from '../plugins/taskPlugin/task'
import { ThothComponent } from '../thoth-component'
import { inputNameFromSocketKey } from '../utils/nodeHelpers'

const info = `The Module component allows you to add modules into your graph.  A module is a bundled self contained graph that defines inputs, outputs, and triggers using components.`

export class SpellComponent extends ThothComponent<
  Promise<ModuleWorkerOutput[]>
> {
  _task: Task
  updateModuleSockets: Function
  task
  info
  subscriptionMap: Record<number, Function> = {}
  editor: ThothEditor
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

  subscribe(node: ThothNode, spellId: string) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()

    // Subscribe to any changes to that spell here
    this.subscriptionMap[node.id] = this.editor.onSpellUpdated(
      spellId,
      (spell: Spell) => {
        // this can probably be better optimise this
        console.log('SPELL UPDATED')
        this.updateSockets(node, spell)
      }
    )
  }

  builder(node: ThothNode) {
    const spellControl = new SpellControl({
      name: 'Spell Select',
      write: false,
    })

    if (node.data.spellId) this.subscribe(node, node.data.spellId as string)

    spellControl.onData = (spell: Spell) => {
      node.data.spellId = spell.name

      // Update the sockets
      this.updateSockets(node, spell)

      // subscribe to changes form the spell to update the sockets if there are changes
      // Note: We could store all spells in a spell map here and rather than receive the whole spell, only receive the diff, make the changes, update the sockets, etc.  Mayb improve speed?
      this.subscribe(node, spell.name)
    }

    node.inspector.add(spellControl)

    return node
  }

  updateSockets(node: ThothNode, spell: Spell) {
    const graph = JSON.parse(JSON.stringify(spell.graph))
    this.updateModuleSockets(node, graph)
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

    if (!thoth.runSpell) return
    const response = await thoth.runSpell(flattenedInputs, node.data.spellId)

    if ('error' in response) {
      throw new Error(`Error running spell ${node.data.spellId}`)
    }

    return response.data.outputs
  }
}
