import Rete from "rete";
import deepEqual from "deep-equal";
import { ModuleControl } from "../dataControls/ModuleControl";

const info = `The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.`;

export class ModuleComponent extends Rete.Component {
  module;
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
    let initialLoad = true;
    let cache;

    this.unsubscribe(node);
    this.subscriptionMap[node.id] = await this.editor.thothV2.findOneModule(
      { name: node.data.module },
      (module) => {
        if (!initialLoad && !deepEqual(cache, module.toJSON()))
          this.updateSockets(node, module.name, true);
        initialLoad = false;
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
    this.subscribe(node);
    node.update();
  }

  worker() {}
}
