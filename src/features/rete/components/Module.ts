import Rete from "rete";
import { ModuleControl } from "../dataControls/ModuleControl";

const info = `The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.`;

export class ModuleComponent extends Rete.Component {
  module;
  updateModuleSockets;
  task;
  info;
  subscriptionMap: {} = {};
  editor: any;

  constructor() {
    super("Module");
    this.module = {
      nodeType: "module",
    };
    this.task = {
      outputs: {},
    };
    this.info = info;
  }

  builder(node) {
    const moduleControl = new ModuleControl({
      name: "Module select",
    });

    if (node.data.module) {
      this.updateModuleSockets(node);
      this.subscribe(node);
    }

    moduleControl.onData = async (data) => {
      // since the module has changed, we want to unsubscribe from the old module
      this.unsubscribe(node);
      this.updateSockets(node);
      if (this.editor) this.editor.trigger("process");
      node.update();
      // attach a new subscription for this new module
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

  subscribe(node) {
    // make sure we dont have a lingering subscription
    if (!node.data.module) return;

    this.unsubscribe(node);
    this.subscriptionMap[node.id] = this.editor.thothV2.findOneModule(
      { name: node.data.module },
      (module) => {
        this.updateSockets(node);
      }
    );
  }

  updateSockets(node) {
    this.updateModuleSockets(node);
    this.editor.trigger("process");
    node.update();
  }

  worker() {}
}
