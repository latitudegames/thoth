import Rete, { Engine } from 'rete'
import { Node } from 'rete/types'

import {
  ModelCompletionOpts,
  ModuleType,
  NodeData,
  OpenAIResultChoice,
  Spell,
  ThothWorkerInputs,
} from '../types'
import debuggerPlugin from './plugins/debuggerPlugin'
import ModulePlugin from './plugins/modulePlugin'
import TaskPlugin from './plugins/taskPlugin'

interface WorkerOutputs {
  [key: string]: unknown
}

export interface ThothEngine extends Engine {
  activateDebugger?: Function
  moduleManager?: any
}
export abstract class ThothEngineComponent<WorkerReturnType> {
  // Original Class: https://github.com/latitudegames/rete/blob/master/src/engine/component.ts
  name: string
  data: unknown = {}
  engine: Engine | null = null

  constructor(name: string) {
    this.name = name
  }

  abstract worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: WorkerOutputs,
    ...args: unknown[]
  ): WorkerReturnType
}

// TODO separate the engine context out from the editor context for cleaner typing.
export type EngineContext = {
  completion: (
    body: ModelCompletionOpts
  ) => Promise<string | OpenAIResultChoice | undefined>
  getCurrentGameState: () => Record<string, unknown>
  updateCurrentGameState: (update: Record<string, unknown>) => void
  enkiCompletion: (
    taskName: string,
    inputs: string[]
  ) => Promise<{ outputs: string[] }>
  huggingface: (
    model: string,
    request: string
  ) => Promise<{ error: unknown; [key: string]: unknown }>
  readFromImageCache: Function
  onPlaytest?: Function
  sendToDebug?: Function
  onAddModule?: Function
  onUpdateModule?: Function
  sendToPlaytest?: Function
  onInspector?: Function
  sendToInspector?: Function
  clearTextEditor?: Function
  processCode?: (
    code: unknown,
    inputs: ThothWorkerInputs,
    data: Record<string, any>
  ) => void
}

export type InitEngineArguments = {
  name: string
  components: any[]
  server: boolean
  modules?: Record<string, ModuleType>
  throwError?: Function
}
// @seang TODO: update this to not use positional arguments
export const initSharedEngine = ({
  name,
  components,
  server = false,
  modules = {},
  throwError,
}: InitEngineArguments) => {
  const engine = new Rete.Engine(name) as ThothEngine

  if (server) {
    // WARNING: ModulePlugin needs to be initialized before TaskPlugin during engine setup
    engine.use(debuggerPlugin, { server: true, throwError })
    engine.use(ModulePlugin, { engine, modules } as any)
    engine.use(TaskPlugin)
  }

  engine.bind('run')

  components.forEach(c => {
    engine.register(c)
  })

  return engine
}

// this parses through all the nodes in the data and finds the nodes associated with the given map
export const extractNodes = (
  nodes: Record<string, Node>,
  map: Set<unknown>
) => {
  const names = Array.from(map.keys())

  return Object.keys(nodes)
    .filter(k => names.includes(nodes[k].name))
    .map(k => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1])
}

// This will get the node that was triggered given a socketKey associated with that node.
export const getTriggeredNode = (
  data: Spell,
  socketKey: string,
  map: Set<unknown>
) => {
  return extractNodes(data.nodes, map).find(
    node => node.data.socketKey === socketKey
  )
}
