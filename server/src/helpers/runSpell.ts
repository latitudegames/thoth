import { Data } from 'rete/types/core/data'
import { EngineContext } from '@latitudegames/thoth-core/dist/src/engine'
import {
  getComponents,
  initSharedEngine,
} from '@latitudegames/thoth-core/server'
import { Module } from 'src/routes/spells/module'
import { Graph, Spell } from 'src/routes/spells/types'
import { extractNodes, ThothEngine } from '../../../core/src/engine'

type RunSpellConstructor = {
  thothInterface: EngineContext
}

class RunSpell {
  engine: ThothEngine
  currentSpell!: Spell
  module: Module
  thothInterface: EngineContext

  constructor({ thothInterface }: RunSpellConstructor) {
    // Initialize the engine
    this.engine = initSharedEngine({
      name: 'demo@0.1.0',
      components: getComponents(),
      server: true,
      modules: {},
    }) as ThothEngine

    // Set up the module to interface with the runtime processes
    this.module = new Module()

    // Set the interface that this runner will use when running workers
    this.thothInterface = thothInterface

    // We should probably load up here all the "modules" the spell needds to run
    // This would basicallyt be an array of spells pulled from the DB
  }

  // getter method for all triggers ins of the loaded spell
  get triggerIns() {
    return this.engine.moduleManager.triggerIns
  }

  get context() {
    return {
      module: this.module,
      thoth: this.thothInterface,
      silent: true,
    }
  }

  loadSpell(spell: Spell) {
    this.currentSpell = spell

    // We process the graph for the new spell which will set up all the task workers
    this.engine.process(spell.graph as Data, null, this.context)
  }

  getFirstNodeTrigger(data: Graph) {
    const extractedNodes = extractNodes(data.nodes, triggerIns)
    return extractedNodes[0]
  }
}

export default RunSpell
