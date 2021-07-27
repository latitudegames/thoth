import { Inspector } from "./Inspector";
import { InfoControl } from "./dataControls/InfoControl";

function install(editor) {
  const { publish, subscribe, events } = editor.pubSub;
  const { onInspector, sendToInspector, clearTextEditor } = editor.thothV2;

  editor.on("componentregister", (component) => {
    const builder = component.builder;

    if (!component.info)
      throw new Error(
        "All components must contain an info property describing the component to the end user."
      );

    // we are going to override the default builder with our own, and will invoke the original builder inside it.
    component.builder = (node) => {
      // This will unsubscribe us
      if (node.subscription) node.subscription();
      // Inspector class which will handle regsistering data controls, serializing, etc.
      node.inspector = new Inspector({ component, editor, node });

      // Adding category to node for display on node
      node.category = component.category;

      // here we attach the default info control to the component which will show up in the inspector
      const infoControl = new InfoControl({
        dataKey: "info",
        name: "Information",
        info: component.info,
      });

      node.inspector.add(infoControl);

      node.subsription = onInspector(node, (data) => {
        node.inspector.handleData(data);
        editor.trigger("nodecreated");
        sendToInspector(node.inspector.data());
      });

      builder.call(component, node);
    };
  });

  let currentNode;

  // handle publishing and subscribing to inspector
  editor.on("nodeselect", (node) => {
    if (currentNode && node.id === currentNode.id) return;
    currentNode = node;
    clearTextEditor();
    sendToInspector(node.inspector.data());
  });
}

export { DataControl } from "./DataControl";

const defaultExport = {
  name: "inspector",
  install,
};

export default defaultExport;
