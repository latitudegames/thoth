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

      node.addControl(display);

      displayMap[node.id] = display;

      builder.call(component, node);
    };

    component.worker = (node, inputs, outputs) => {
      if (displayMap[node.id])
        node.display = displayMap[node.id].display.bind(displayMap[node.id]);

      worker.call(component, node, inputs, outputs);
    };
  });
}

const defaultExport = {
  name: "displayPlugin",
  install,
};

export default defaultExport;
