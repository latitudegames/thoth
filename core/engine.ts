
import Rete from "rete";
import ModulePlugin from "./plugins/modulePlugin";
import TaskPlugin from "./plugins/taskPlugin";
import { ModelCompletionOpts, OpenAIResultChoice, Spell, ThothWorkerOutputs } from "./types";
import { Node } from "rete/types";
import { ThothNode } from "./types";


import { Engine } from 'rete';
import { WorkerInputs, WorkerOutputs } from 'rete/src/core/data';


export type WorkerReturn = Node | ThothWorkerOutputs | void | Promise<void> | Promise<{ actionType: string }> | Promise<{ difficulty?: string, category?: string }> | Promise<{ [output: string]: string } | null>
export abstract class ThothEngineComponent {
  // Original Class: https://github.com/latitudegames/rete/blob/master/src/engine/component.ts
  name: string;
  data: unknown = {};
  engine: Engine | null = null;

  constructor(name: string) {
    this.name = name;
  }

  abstract worker(node: ThothNode, inputs: WorkerInputs, outputs: WorkerOutputs, ...args: unknown[]): WorkerReturn
}
export type EngineContext = {
  completion: (body: ModelCompletionOpts) => Promise<String | OpenAIResultChoice | undefined>,
  getCurrentGameState: () => Record<string, unknown>
  updateCurrentGameState: () => Record<string, unknown>,
  enkiCompletion: (taskName: string, inputs: string[]) => { outputs: string[] }
}

export const initSharedEngine = (name: string, modules: any[], components: any[], server: boolean = false) => {
  const engine = new Rete.Engine(name);

  engine.use(ModulePlugin, { engine, modules } as any);

  if (server) {
    engine.use(TaskPlugin);
  }

  engine.bind("run");

  components.forEach((c) => {
    engine.register(c);
  });

  return engine;
}

// this parses through all the nodes in the data and finds the nodes associated with the given map
export const extractNodes = (nodes: Record<string, Node>, map: Set<unknown>) => {
  const names = Array.from(map.keys());

  return Object.keys(nodes)
    .filter((k) => names.includes(nodes[k].name))
    .map((k) => nodes[k])
    .sort((n1, n2) => n1.position[1] - n2.position[1]);
}

// This will get the node that was triggered given a socketKey associated with that node.
export const getTriggeredNode = (data: Spell, socketKey: string, map: Set<unknown>) => {
  return extractNodes(data.nodes, map).find(
    (node) => node.data.socketKey === socketKey
  );
}