import { DisplayControl } from "./DisplayControl";

function install(editor) {
  editor.on("componentregister", (component) => {
    const worker = component.worker;
    const builder = component.builder;

    const displayMap = {};

    component.builder = (node) => {
      const display = new DisplayControl({
        key: "display",
        defaultDisplay: "",
      });

      if (component.display) {
        node.addControl(display);
        displayMap[node.id] = display;
      }

      builder.call(component, node);
    };

    component.worker = (node, inputs, outputs, data, ...args) => {
      if (displayMap[node.id] && !module)
        node.display = displayMap[node.id].display.bind(displayMap[node.id]);

      // handle modules, which are in the engine run
      if (data?.silent) node.display = () => {};

      return worker.call(component, node, inputs, outputs, data, ...args);
    };
  });
}

const defaultExport = {
  name: "displayPlugin",
  install,
};

export default defaultExport;
