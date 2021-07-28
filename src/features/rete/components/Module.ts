import Rete from "rete";
import { ModuleControl } from "../dataControls/ModuleControl";

const info = `The Module component allows you to add modules into your chain.  A module is a bundled self contained chain that defines inputs, outputs, and triggers using components.`;

export class ModuleComponent extends Rete.Component {
  module;
  updateModuleSockets;
  task;
  info;

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

    moduleControl.onData = async (data) => {
      this.updateModuleSockets(node);
    };

    node.inspector.add(moduleControl);

    return node;
  }

  change(node, item) {
    node.data.module = item;
    if (this.editor) this.editor.trigger("process");
  }

  worker() {}
}
