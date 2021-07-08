function install(editor) {
  // Track all main data controls

  // handle publishing and subscribing to inspector
  editor.on("nodeselect", (node) => {
    const { publish, subscribe, events } = editor.pubSub;

    publish(events.INSPECTOR_SET, {
      name: node.name,
      nodeId: node.id,
      dataControls: node.dataControls,
      data: node.data,
    });

    // we set up a subscribe to that nodes channel when it saves data.
    subscribe(events.NODE_SET(node.id), (event, { data }) => {
      node.data = data;
      node.onData(data);

      node.update();
    });
  });

  editor.on("componentregister", (component) => {
    const builder = component.builder;

    // we are going to override the default builder with our own, and will invoke the original builder inside it.
    component.builder = (node) => {
      // Maybe make this a set?
      node.dataControls = {};

      node.addDataControl = (dataControl, callback = () => {}) => {
        // Maybe perform some checks here?
        // Maybe make dataController a class?
        node.dataControls = {
          ...node.dataControls,
          ...dataControl,
        };

        // Attach a callback to the node when data comes in.
        node.onData = callback;
      };

      // stubbed function for now as reminder
      node.removeDataControl = () => {};

      builder.call(component, node);
    };
  });
}

const defaultExport = {
  name: "inspector",
  install,
};

export default defaultExport;
