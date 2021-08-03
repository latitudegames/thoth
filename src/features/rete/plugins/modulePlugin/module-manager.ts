import { NodeData } from "rete/types/core/data";
import { Engine, Socket, Component } from "rete";

import { Module as ModuleType } from "../../../../database/schemas/module";
import { Module } from "./module";
import { extractNodes } from "./utils";

interface ModuleComponent extends Component {
  run: Function;
}

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
    const index = this.modules.findIndex((mod) => mod.id === module.id);

    if (index > -1) this.modules[index] = module;
  }

  getInputs(data) {
    return extractNodes(data.nodes, this.inputs).map((node: NodeData) => ({
      name: node.data.name,
      socket: this.socketFactory(node, this.inputs.get(node.name)),
    }));
  }

  getOutputs(data) {
    return extractNodes(data.nodes, this.outputs).map((node) => ({
      name: node.data.name,
      socket: this.socketFactory(node, this.outputs.get(node.name)),
    }));
  }

  getTriggerOuts(data) {
    return extractNodes(data.nodes, this.triggerOuts).map((node) => ({
      name: node.data.name,
      socket: this.socketFactory(node, this.triggerOuts.get(node.name)),
    }));
  }

  getTriggerIns(data) {
    return extractNodes(data.nodes, this.triggerIns).map((node) => ({
      name: node.data.name,
      socket: this.socketFactory(node, this.triggerIns.get(node.name)),
    }));
  }

  socketFactory(node: NodeData, socket: Socket | Function | undefined) {
    socket = typeof socket === "function" ? socket(node) : socket;

    if (!socket)
      throw new Error(
        `Socket not found for node with id = ${node.id} in the module`
      );

    return socket;
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
