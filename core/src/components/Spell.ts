import Rete from 'rete'
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
import { objectSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'
import {
  inputNameFromSocketKey,
  socketKeyFromOutputName,
} from '../utils/nodeHelpers'

const info = `The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.`

export class SpellComponent extends ThothComponent<
  Promise<ModuleWorkerOutput>
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
      defaultValue: (node.data.spell as string) || '',
    })

    if (node.data.spellId) this.subscribe(node, node.data.spellId as string)

    const stateSocket = new Rete.Input('state', 'State', objectSocket)

    spellControl.onData = (spell: Spell) => {
      node.data.spellId = spell.name

      // Update the sockets
      this.updateSockets(node, spell)

      // here we handle writing the spells name to the spell itself
      node.data.spell = spell.name

      // Uodate the data name to display inside the node
      node.data.name = spell.name

      // subscribe to changes form the spell to update the sockets if there are changes
      // Note: We could store all spells in a spell map here and rather than receive the whole spell, only receive the diff, make the changes, update the sockets, etc.  Mayb improve speed?
      this.subscribe(node, spell.name)
    }

    node.addInput(stateSocket)
    node.inspector.add(spellControl)

    return node
  }

  updateSockets(node: ThothNode, spell: Spell) {
    const chain = JSON.parse(JSON.stringify(spell.chain))
    this.updateModuleSockets(node, chain, true)
    this.editor.trigger('process')
    node.update()
  }

  formatOutputs(node: NodeData, outputs: Record<string, any>) {
    return Object.entries(outputs).reduce((acc, [key, value]) => {
      const socketKey = socketKeyFromOutputName(node, key)
      if (!socketKey) return acc
      acc[socketKey] = value
      return acc
    }, {} as Record<string, any>)
  }

  formatInputs(node: NodeData, inputs: Record<string, any>) {
    return Object.entries(inputs).reduce((acc, [key, value]) => {
      const name = inputNameFromSocketKey(node, key)
      if (!name) return acc

      acc[name] = value[0]
      return acc
    }, {} as Record<string, any>)
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
    // // If there is a module present, this is runnign via the module plugin
    // if (module) {
    //   const open = Object.entries(module.outputs)
    //     .filter(([, value]) => typeof value === 'boolean' && value)
    //     .map(([key]) => key)
    //   // close all triggers first
    //   const dataOutputs = node.data.outputs as ModuleWorkerOutput[]
    //   this._task.closed = dataOutputs
    //     .map((out: { name: string }) => out.name)
    //     .filter((out: string) => !open.includes(out))

    //   return module.outputs
    // }

    // Otherwise, if we are, this is running serverside.
    const flattenedInputs = this.formatInputs(node, inputs)

    if (!thoth.runSpell) return {}
    const response = await thoth.runSpell(flattenedInputs, node.data.spellId)

    if ('error' in response) {
      throw new Error(`Error running spell ${node.data.spellId}`)
    }

    return response.data.outputs
  }
}
