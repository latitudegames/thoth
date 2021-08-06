import { NodeData } from "rete/types/core/data";
import { Socket as SocketType } from "rete/types";
import { Engine, Socket, Component } from "rete";

import { Module as ModuleType } from "../../../../database/schemas/module";
import { Module } from "./module";
import { extractNodes } from "./utils";

interface ModuleComponent extends Component {
  run: Function;
}

export type ModuleSocketType = {
  name: string;
  socketKey: string;
  socket: SocketType;
};

export class ModuleManager {
  engine?: Engine | null;
  modules: ModuleType[];
  inputs = new Map<string, Socket>();
  outputs = new Map<string, Socket>();
  triggerIns = new Map<string, Socket>();
  triggerOuts = new Map<string, Socket>();

  constructor(modules) {
    this.modules = modules;
    this.inputs = new Map();
    this.outputs = new Map();
    this.triggerIns = new Map();
    this.triggerOuts = new Map();
  }

  addModule(module: ModuleType) {
    this.modules.push(module);
  }

  setModules(modules: ModuleType[]) {
    this.modules = modules;
  }

  updateModule(module: ModuleType) {
    this.modules[module.name] = module;
  }

  getSockets(data, typeMap, defaultName: string): ModuleSocketType[] {
    return extractNodes(data.nodes, typeMap).map(
      (node, i): ModuleSocketType => {
        node.data.name = node.data.name || `${defaultName}-${i + 1}`;
        return {
          name: node.data.name as string,
          socketKey: node.data.socketKey as string,
          socket: this.socketFactory(node, typeMap.get(node.name)),
        };
      }
    );
  }

  getInputs(data): ModuleSocketType[] {
    return this.getSockets(data, this.inputs, "input");
  }

  getOutputs(data): ModuleSocketType[] {
    return this.getSockets(data, this.outputs, "output");
  }

  getTriggerOuts(data): ModuleSocketType[] {
    return this.getSockets(data, this.triggerOuts, "trigger");
  }

  getTriggerIns(data) {
    return this.getSockets(data, this.triggerIns, "trigger");
  }

  socketFactory(
    node: NodeData,
    socket: Socket | Function | undefined
  ): SocketType {
    socket = typeof socket === "function" ? socket(node) : socket;

    if (!socket)
      throw new Error(
        `Socket not found for node with id = ${node.id} in the module`
      );

    return socket as SocketType;
  }

  registerInput(name, socket) {
    this.inputs.set(name, socket);
  }

  registerTriggerIn(name, socket) {
    this.triggerIns.set(name, socket);
  }

  registerTriggerOut(name, socket) {
    this.triggerOuts.set(name, socket);
  }

  registerOutput(name, socket) {
    this.outputs.set(name, socket);
  }

  getTriggeredNode(data, triggerName) {
    return extractNodes(data.nodes, this.triggerIns).find(
      (node) => node.data.name === triggerName
    );
  }

  async workerModule(node, inputs, outputs, args) {
    if (!node.data.module) return;
    if (!this.modules[node.data.module]) return;

    const data = this.modules[node.data.module].data as any;
    const module = new Module();
    const engine = this.engine?.clone();

    module.read(inputs);
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

  workerInputs(node, inputs, outputs, { module }: { module: Module }) {
    if (!module) return;

    outputs["output"] = (module.getInput(node.data.name) || [])[0];
    return outputs;
  }

  workerOutputs(node, inputs, outputs, { module }: { module: Module }) {
    if (!module) return;

    module.setOutput(node.data.name, inputs["input"][0]);
  }

  workerTriggerIns(
    node,
    inputs,
    outputs,
    { module, ...rest }: { module: Module }
  ) {
    if (!module) return;

    // module.setOutput(node.data.name, inputs["input"][0]);
  }

  workerTriggerOuts(
    node,
    inputs,
    outputs,
    { module, ...rest }: { module: Module }
  ) {
    if (!module) return;

    module.setOutput(node.data.name, outputs["trigger"]);
  }

  setEngine(engine) {
    this.engine = engine;
  }
}
