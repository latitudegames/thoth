import { Component } from "rete";
import { Node } from "rete/types";
import { Inspector } from "./plugins/inspectorPlugin/Inspector";
import { NodeData as ReteNodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";


export type ThothNode = Node & {
  inspector: Inspector
}

export type ModuleType = {
    id: String;
    name: string;
    data: object;
    createdAt: number;
    updatedAt: number;
  };

export type ModelCompletionOpts = {
    model: string
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
    text: string,
    index: number,
    logprobs: number[],
    "top_logprobs": any[],
    "text_offset": number[]
  }

  export type  OpenAIResponse =  {
    id: string,
    object: string,
    created: number,
    model: string,
    choices: OpenAIResultChoice[]
    "finish_reason": string
  }

  export type ModuleComponent = Component & {
    run: Function
  };
  
  export type NodeConnections = {
    node: number,
    input?: string,
    output?: string,
    data: Record<string, unknown>
  }
  
  export type NodeOutputs = {
    output?: {
      connections: NodeConnections[]
    },
    trigger?: {
      connections: NodeConnections[]
    },
    action?: {
      connections: NodeConnections[]
    }
  }
  
 export type NodeData = ReteNodeData & {}
  
  // export type Node = {
  //   id: number,
  //   data: NodeData,
  //   name: string,
  //   inputs: NodeOutputs,
  //   outputs?: NodeOutputs,
  //   position: number[]
  // }
  
  export type Spell = {
    id: string,
    nodes: Record<number, Node>
  }

  export type ThothWorkerInputs = WorkerInputs & {}
  export type ThothWorkerOutputs = WorkerOutputs & {}
