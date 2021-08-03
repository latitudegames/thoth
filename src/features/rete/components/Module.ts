import Rete from "rete";
import deepEqual from "deep-equal";
import { ModuleControl } from "../dataControls/ModuleControl";

const info = `The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.`;

export class ModuleComponent extends Rete.Component {
  module;
  _task;
  updateModuleSockets;
  task;
  info;
  subscriptionMap: {} = {};
  editor: any;
  noBuildUpdate: boolean;
  category: string;

  constructor() {
    super("Module");
    this.module = {
      nodeType: "module",
    };
    this.task = {
      outputs: {},
    };
    this.category = "Core";
    this.info = info;
    this.noBuildUpdate = true;
  }

  builder(node) {
    const moduleControl = new ModuleControl({
      name: "Module select",
      write: false,
    });

    if (node.data.module) {
      this.subscribe(node);
    }

    moduleControl.onData = async (moduleName) => {
      this.updateSockets(node, moduleName);
      this.subscribe(node);
    };

    node.inspector.add(moduleControl);

    return node;
  }

  destroyed(node) {
    this.unsubscribe(node);
  }

  unsubscribe(node) {
    if (!this.subscriptionMap[node.id]) return;

    this.subscriptionMap[node.id].unsubscribe();
    delete this.subscriptionMap[node.id];
  }

  async subscribe(node) {
    if (!node.data.module) return;

    let cache;

    this.unsubscribe(node);
    this.subscriptionMap[node.id] = await this.editor.thothV2.findOneModule(
      { name: node.data.module },
      (module) => {
        // TODO the deep equal isnt catching the changed to node data from submodule, needed to rerender socket names
        if (cache && !deepEqual(cache, module.toJSON()))
          this.updateSockets(node, module.name, true);
        cache = module.toJSON();
      }
    );
  }

  updateSockets(node, moduleName, skipCheck = false) {
    if (!skipCheck && node.data.module === moduleName) return;
    node.data.module = moduleName;
    node.data.inputs = [];
    node.data.outputs = [];
    this.updateModuleSockets(node);
    this.editor.trigger("process");
    node.update();
  }

  worker(node, inputs, outputs, { module }) {
    const open = Object.entries(module.outputs)
      .filter(([key, value]) => typeof value === "boolean" && value)
      .map(([key]) => key);
    // close all triggers first
    this._task.closed = node.data.outputs
      .map((out) => out.name)
      .filter((out) => !open.includes(out));

    return module.outputs;
  }
}
