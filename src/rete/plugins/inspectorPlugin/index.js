function install(editor) {
  // handle publishing and subscribing to inspector
  editor.on("nodeselect", (node) => {
    const component = editor.getComponent(node.name);
    const { publish, subscribe, events } = editor.pubSub;

    publish(events.INSPECTOR_SET, {
      name: node.name,
      nodeId: node.id,
      dataControls: component.dataControls,
      data: node.data,
    });

    // we set up a subscribe to that nodes channel when it saves data.
    subscribe(events.NODE_SET(node.id), (event, { data }) => {
      node.data = data;

      console.log("WORKING");

      if (node.onInspector) {
        node.onInspector(data);
      }
      node.update();
    });
  });

  editor.on("componentregister", (component) => {
    // nodes in builder have access to an 'addDataControl' function
    // they can add dataControls as an object?
    // callback can be added
    // dataControl is registered on the node
    // data control subscribes to
  });
}

const defaultExport = {
  name: "inspector",
  install,
};

export default defaultExport;
