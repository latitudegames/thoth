import { Component } from "rete";
import { EventsTypes as DefaultEventsTypes } from "rete/types/events";
import { Node } from "rete/types";
//@seang todo: convert inspector plugin fully to typescript
//@ts-ignore 
import { Inspector } from "./plugins/inspectorPlugin/Inspector";
import { NodeData as ReteNodeData, WorkerInputs, WorkerOutputs } from "rete/types/core/data";
import { ModuleGraphData } from "./plugins/modulePlugin/module-manager";
import { TaskOutputTypes } from "./plugins/taskPlugin/task";
import { ThothTask } from "./thoth-component";

export type EventsTypes = DefaultEventsTypes & {
  run: void;
  save: void;
  [key: string]: unknown;
}

export type ThothNode = Node & {
  inspector: Inspector
  display: (content: string) => void,
  outputs: { name: string, [key: string]: unknown }[]
}

export type ModuleType = {
  id: String;
  name: string;
  data: ModuleGraphData;
  createdAt: number;
  updatedAt: number;
};

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
  text: string,
  index: number,
  logprobs: number[],
  "top_logprobs": any[],
  "text_offset": number[]
}

export type OpenAIResponse = {
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

export type NodeData = ReteNodeData & {
  fewshot?: string,
  display: Function
}

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

export type ThothWorkerBaseInput = {type: TaskOutputTypes;outputData: unknown;task:ThothTask, key: string}
export type ThothWorkerInput = ThothWorkerBaseInput | string | unknown[]
export type ThothWorkerInputs = {[key:string]:ThothWorkerInput[]}
export type ThothWorkerOutputs = WorkerOutputs & { [key: string]: string[] | string; }
export type WorkerReturn = Node | ThothWorkerOutputs | void | Promise<void> | Promise<{ actionType: string }> | Promise<{ difficulty?: string, category?: string }> | Promise<{ [output: string]: string } | null> | Promise<never[] | { entities: { name: string; type: string; }[]; }> | Promise<{ element: unknown; } | undefined> | Promise<{ result: { error: unknown, [key: string]: unknown } } | { result?: undefined }> | Promise<{ text: unknown }> | Promise<{ boolean: boolean; }> | Promise<null | undefined> | WorkerOutputs[] | { trigger: boolean }
export type ThothWorker = (node: ThothNode, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]) => WorkerReturn

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
        name: string;
        version: string;
    }

    interface CountSubscriptions {
        countSubscriptions(token: any): number;
    }

    interface ClearAllSubscriptions {
        clearAllSubscriptions(token?: any): void;
    }

    interface GetSubscriptions {
        getSubscriptions(token: any): any[];
    }

    interface Publish {
        publish(message: string | Symbol, data?: any): boolean;

        publishSync(message: string | Symbol, data?: any): boolean;
    }

    interface Subscribe {
        subscribe(message: string | Symbol, func: Function): string;

        subscribeOnce(message: string | Symbol, func: Function): any;
    }

    interface Unsubscribe {
        unsubscribe(tokenOrFunction: any): any;
    }
