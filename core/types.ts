/* eslint-disable camelcase */
import { Component, Connection, Input, Output, NodeEditor } from 'rete'
import { Node } from 'rete/types'
//@seang todo: convert inspector plugin fully to typescript
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import {
  NodeData as ReteNodeData,
  WorkerInputs,
  WorkerOutputs,
} from 'rete/types/core/data'

import { Inspector } from './src/plugins/inspectorPlugin/Inspector'
import { TaskOutputTypes } from './src/plugins/taskPlugin/task'
import { SocketNameType, SocketType } from './src/sockets'
import { EngineContext } from './src/engine'
import { ThothTask } from './src/thoth-component'
import { ThothConsole } from './src/plugins/debuggerPlugin/ThothConsole'
import { Data } from 'rete/types/core/data'
export { ThothEditor } from './src/editor'

export type { InspectorData } from './src/plugins/inspectorPlugin/Inspector'

export type EventsTypes = {
  run: void
  save: void
  [key: string]: unknown
  //EventTypes from rete/types/events
  connectionpath: {
    points: number[]
    connection: Connection
    d: string
  }
  connectiondrop: Input | Output
  connectionpick: Input | Output
  resetconnection: void
}

export interface Spell {
  id?: string
  user?: Record<string, unknown> | null | undefined
  name: string
  graph: GraphData
  // Spells: Module[]
  gameState: Record<string, unknown>
  createdAt?: number
  updatedAt?: number
}

export interface IRunContextEditor extends NodeEditor {
  thoth: EngineContext
  abort: Function
}

export type DataSocketType = {
  name: SocketNameType
  taskType: 'output' | 'option'
  socketKey: string
  connectionType: 'input' | 'output'
  socketType: SocketType
}

export type ThothNode = Node & {
  inspector: Inspector
  display: (content: string) => void
  outputs: { name: string;[key: string]: unknown }[]
  category?: string
  deprecated?: boolean
  displayName?: string
  info: string
  subscription: Function
  console: ThothConsole
}

export type ModuleType = {
  id: string
  name: string
  data: GraphData
  createdAt: number
  updatedAt: number
}

export type ModelCompletionOpts = {
  model?: string
  prompt?: string
  maxTokens?: number
  temperature?: number
  topP?: number
  n?: number
  stream?: boolean
  logprobs?: number
  echo?: boolean
  stop?: string | string[]
  presencePenalty?: number
  frequencyPenalty?: number
  bestOf?: number
  user?: string
  logitBias?: { [token: string]: number }
}

export type OpenAIResultChoice = {
  text: string
  index: number
  logprobs: number[]
  top_logprobs: any[]
  text_offset: number[]
}

export type OpenAIResponse = {
  id: string
  object: string
  created: number
  model: string
  choices: OpenAIResultChoice[]
  finish_reason: string
}

export type Subspell = { name: string; id: string; data: GraphData }

export type ModuleComponent = Component & {
  run: Function
}

export type NodeConnections = {
  node: number
  input?: string
  output?: string
  data: Record<string, unknown>
}

export type NodeOutputs = {
  output?: {
    connections: NodeConnections[]
  }
  trigger?: {
    connections: NodeConnections[]
  }
  action?: {
    connections: NodeConnections[]
  }
}

export type GraphData = Data

export type NodeData = ReteNodeData & {
  fewshot?: string
  display: Function
  error?: boolean
  console: ThothConsole
}

// export type Node = {
//   id: number,
//   data: NodeData,
//   name: string,
//   inputs: NodeOutputs,
//   outputs?: NodeOutputs,
//   position: number[]
// }

// export type Spell = {
//   id: string
//   nodes: Record<number, Node>
// }

export type ThothReteInput = {
  type: TaskOutputTypes
  outputData: unknown
  task: ThothTask
  key: string
}

export type TaskOutput = {
  type: TaskOutputTypes
  task: ThothTask
  key: string
}

export type ModuleWorkerOutput = WorkerOutputs & {
  [key: string]: string | string[]
}
export type ThothWorkerInput = string | unknown | unknown[]
export type ThothWorkerInputs = { [key: string]: ThothWorkerInput[] }
export type ThothWorkerOutputs = WorkerOutputs & {
  [key: string]: TaskOutput
}

export type WorkerReturn =
  | Node
  | ThothWorkerOutputs
  | void
  | Promise<void>
  | Promise<{ actionType: string }>
  | Promise<{ difficulty?: string; category?: string }>
  | Promise<{ [output: string]: string } | null>
  | Promise<never[] | { entities: { name: string; type: string }[] }>
  | Promise<{ element: unknown } | undefined>
  | Promise<
    | { result: { error: unknown;[key: string]: unknown } }
    | { result?: undefined }
  >
  | Promise<{ text: unknown }>
  | Promise<{ boolean: boolean }>
  | Promise<null | undefined>
  | WorkerOutputs[]
  | { trigger: boolean }
export type ThothWorker = (
  node: ThothNode,
  inputs: WorkerInputs,
  outputs: WorkerOutputs,
  ...args: unknown[]
) => WorkerReturn

// Type definitions for PubSubJS 1.8.0
// Project: https://github.com/mroderick/PubSubJS
// Definitions by: Boris Yankov <https://github.com/borisyankov>
//                 Matthias Lindinger <https://github.com/morpheus-87>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export interface PubSubBase
  extends CountSubscriptions,
  ClearAllSubscriptions,
  GetSubscriptions,
  Publish,
  Subscribe,
  Unsubscribe {
  name: string
  version: string
}

interface CountSubscriptions {
  countSubscriptions(token: any): number
}

interface ClearAllSubscriptions {
  clearAllSubscriptions(token?: any): void
}

interface GetSubscriptions {
  getSubscriptions(token: any): any[]
}

interface Publish {
  publish(message: string | symbol, data?: any): boolean

  publishSync(message: string | symbol, data?: any): boolean
}

interface Subscribe {
  subscribe(message: string | symbol, func: Function): string

  subscribeOnce(message: string | symbol, func: Function): any
}

interface Unsubscribe {
  unsubscribe(tokenOrFunction: any): any
}
