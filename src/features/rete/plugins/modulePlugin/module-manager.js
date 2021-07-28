import { Module } from "./module";
import { extractNodes } from "./utils";

export class ModuleManager {
  constructor(modules) {
    this.engine = null;
    this.modules = modules;
    this.inputs = new Map();
    this.outputs = new Map();
    this.triggerIns = new Map();
    this.triggerOuts = new Map();
  }

  addModule(module) {
    this.modules.push(module);
  }

  setModules(modules) {
    this.modules = modules;
  }

  updateModule(module) {
    const index = this.modules.findIndex((mod) => mod.id === module.id);

    if (index > -1) this.modules[index] = module;
  }

  getInputs(data) {
    return extractNodes(data.nodes, this.inputs).map((node) => ({
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

  socketFactory(node, socket) {
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

  async workerModule(node, inputs, outputs, args) {
    if (!node.data.module) return;
    if (!this.modules[node.data.module]) return;

    const data = this.modules[node.data.module].data;
    const module = new Module();
    const engine = this.engine.clone();

    module.read(inputs);
    await engine.process(
      data,
      null,
      Object.assign({}, args, { module, silent: true })
    );
    // find data socket that was triggered in the node
    if (args?.data?.socketKey) {
      console.log("We know which socket was triggered!");
    }
    // call await node.run()
    // gather the outputs
    module.write(outputs);
  }

  workerInputs(node, inputs, outputs, { module } = {}) {
    if (!module) return;

    // this is a worker.IN thoery it could return an object for the task instead
    // or set a taskOutputs to themodule class itself

    outputs["output"] = (module.getInput(node.data.name) || [])[0];
  }

  workerOutputs(node, inputs, outputs, { module } = {}) {
    if (!module) return;

    module.setOutput(node.data.name, inputs["input"][0]);
  }

  workerTriggers(node, inputs, outputs, { module } = {}) {
    if (!module) return;

    // module.setOutput(node.data.name, inputs["input"][0]);
  }

  setEngine(engine) {
    this.engine = engine;
  }
}
