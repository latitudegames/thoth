import { Inspector } from "./Inspector";

function install(editor) {
  const { publish, subscribe, events } = editor.pubSub;

  let currentNode = null;
  let unsubscribe = null;

  editor.on("componentregister", (component) => {
    const builder = component.builder;

    // we are going to override the default builder with our own, and will invoke the original builder inside it.
    component.builder = (node) => {
      // Inspector class which will handle regsistering data controls, serializing, etc.
      node.inspector = new Inspector({ component, editor, node });
      node.category = component.category
      builder.call(component, node);
    };
  });

  // handle publishing and subscribing to inspector
  editor.on("nodeselect", (node) => {
    if (node === currentNode) return;
    if (unsubscribe) unsubscribe();

    currentNode = node;
    // clear spaces first
    publish(events.TEXT_EDITOR_SET, {});

    // Set inspector
    publish(events.INSPECTOR_SET, node.inspector.data());

    // we set up a subscribe to that nodes channel when it saves data.
    unsubscribe = subscribe(events.$NODE_SET(node.id), (event, data) => {
      node.inspector.handleData(data);
      editor.trigger("nodecreated");
      publish(events.INSPECTOR_SET, node.inspector.data());
    });

    // we need to unsibscribe when a new node is selected
  });
}

export { DataControl } from "./DataControl";

const defaultExport = {
  name: "inspector",
  install,
};

export default defaultExport;
