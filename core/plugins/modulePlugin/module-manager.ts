import { Socket as SocketType } from "rete/types";
import { Engine, Socket, Component } from "rete";

import { Module } from "./module";
import { ModuleType } from "../../types"
import { extractNodes } from "./utils";
import { ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from "../../types";
import { SocketNameType } from "../../sockets";
interface ModuleComponent extends Component {
  run: Function;
}

export type ModuleSocketType = {
  name: SocketNameType;
  socketKey: string;
  socket: SocketType;
  [key: string]: unknown
};

export type ModuleGraphData = { nodes: Record<string, ThothNode> }
export class ModuleManager {
  engine?: Engine | null;
  modules: Record<string, ModuleType>;
  inputs = new Map<string, Socket>();
  outputs = new Map<string, Socket>();
  triggerIns = new Map<string, Socket>();
  triggerOuts = new Map<string, Socket>();

  constructor(modules: Record<string, ModuleType>) {
    this.modules = modules;
    this.inputs = new Map();
    this.outputs = new Map();
    this.triggerIns = new Map();
    this.triggerOuts = new Map();
  }

  addModule(module: ModuleType) {
    this.modules[module.name] = module;
  }

  setModules(modules: Record<string, ModuleType>) {
    this.modules = modules;
  }

  updateModule(module: ModuleType) {
    this.modules[module.name as string] = module;
  }

  getSockets(data: { nodes: Record<string, ThothNode> }, typeMap: Map<string, Socket>, defaultName: string): ModuleSocketType[] {
    return extractNodes(data.nodes, typeMap).map(
      (node, i): ModuleSocketType => {
        node.data.name = node.data.name || `${defaultName}-${i + 1}`;
        return {
          name: node.data.name as SocketNameType,
          socketKey: node.data.socketKey as string,
          socket: this.socketFactory(node, typeMap.get(node.name)),
        };
      }
    );
  }

  getInputs(data: ModuleGraphData): ModuleSocketType[] {
    return this.getSockets(data, this.inputs, "input");
  }

  getOutputs(data: ModuleGraphData): ModuleSocketType[] {
    return this.getSockets(data, this.outputs, "output");
  }

  getTriggerOuts(data: ModuleGraphData): ModuleSocketType[] {
    return this.getSockets(data, this.triggerOuts, "trigger");
  }

  getTriggerIns(data: ModuleGraphData) {
    return this.getSockets(data, this.triggerIns, "trigger");
  }

  socketFactory(
    node: ThothNode,
    socket: Socket | Function | undefined
  ): SocketType {
    socket = typeof socket === "function" ? socket(node) : socket;

    if (!socket)
      throw new Error(
        `Socket not found for node with id = ${node.id} in the module`
      );

    return socket as SocketType;
  }

  registerInput(name: string, socket: Socket) {
    this.inputs.set(name, socket);
  }

  registerTriggerIn(name: string, socket: Socket) {
    this.triggerIns.set(name, socket);
  }

  registerTriggerOut(name: string, socket: Socket) {
    this.triggerOuts.set(name, socket);
  }

  registerOutput(name: string, socket: Socket) {
    this.outputs.set(name, socket);
  }

  getTriggeredNode(data: { nodes: Record<string, ThothNode> }, socketKey: string) {
    return extractNodes(data.nodes, this.triggerIns).find(
      (node) => node.data.socketKey === socketKey
    );
  }

  async workerModule(node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, args: { socketInfo: { target: string } }) {
    if (!node.data.module) return;
    if (!this.modules[node.data.module as number]) return;
    const moduleName = node.data.module as string
    const data = this.modules[moduleName].data as any;
    const module = new Module();
    const engine = this.engine?.clone();

    const parsedInputs = Object.entries(inputs).reduce((acc, [key, value]) => {
      const nodeInputs = node.data.inputs as ModuleSocketType[]
      const name = nodeInputs?.find((n: ModuleSocketType) => n?.socketKey === key)?.name
      if (typeof name === "string") {
        acc[name] = value;
        return acc;
      }
    }, {} as Record<string, unknown>) as Record<string, unknown>;

    module.read(parsedInputs);
    await engine?.process(
      data,
      null,
      Object.assign({}, args, { module, silent: true })
    );

    if (args?.socketInfo?.target) {
      const triggeredNode = this.getTriggeredNode(data, args.socketInfo.target);
      // todo need to remember to update this if/when componnet name changes
      const component = engine?.components.get(
        "Module Trigger In"
      ) as ModuleComponent;
      await component?.run(triggeredNode);
    }
    // gather the outputs
    module.write(outputs);

    return module;
  }

  workerInputs(node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { module }: { module: Module }) {
    if (!module) return;
    const nodeDataName = node.data.name as string
    outputs["output"] = (module.getInput(nodeDataName) as string[] || [] as string[])[0];
    return outputs;
  }

  workerOutputs(node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { module }: { module: Module }) {
    if (!module) return;
    const socketKey = node.data.socketKey as string
    module.setOutput(socketKey, inputs["input"][0]);
  }

  workerTriggerIns(
    node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs,
    { module, ...rest }: { module: Module }
  ) {
    if (!module) return;

    // module.setOutput(node.data.name, inputs["input"][0]);
  }

  workerTriggerOuts(
    node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs,
    { module, ...rest }: { module: Module }
  ) {
    if (!module) return;
    const socketKey = node.data.socketKey as string
    module.setOutput(socketKey, outputs["trigger"]);
  }

  setEngine(engine: Engine) {
    this.engine = engine;
  }
}
