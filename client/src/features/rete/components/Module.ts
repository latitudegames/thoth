import Rete from "rete";
import isEqual from "lodash/isEqual";
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
        if (cache && !isEqual(cache, module.toJSON())) {
          // make sure that the module manager has the latest updated version of the module
          this.editor.moduleManager.updateModule(module.toJSON());
          this.updateSockets(node, module.name);
        }
        cache = module.toJSON();
      }
    );
  }

  updateSockets(node, moduleName) {
    node.data.module = moduleName;
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
