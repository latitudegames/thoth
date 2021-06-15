import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import { MyNode } from "./components/Node";
import { AddComponent } from "./nodes/AddComponent";

// Put custom sockets here
export const numSocket = new Rete.Socket("Number value");

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/
const editor = async function (container) {
  // Here we load up all components of the builder into our editor for usage.
  // We might be able to programatically generate components from enki
  const components = [new AddComponent()];

  // create the main edtor
  const editor = new Rete.NodeEditor("demo@0.1.0", container);

  // PLUGINS
  // connection plugin is used to render conections between nodes
  editor.use(ConnectionPlugin);

  // React rendering for the editor
  editor.use(ReactRenderPlugin, {
    // MyNode is a custom default style for nodes
    component: MyNode,
  });

  // renders a context menu on right click that shows available nodes
  editor.use(ContextMenuPlugin);

  // The engine is used to process/run the rete graph
  const engine = new Rete.Engine("demo@0.1.0");

  // Register custom components with both the editor and the engine
  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  // List for changes to the editor.  When they are detected, run the graph in the engine
  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      console.log("process");

      // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
      // Then we run the fewshots, etc on the backend rather than on the client.
      // Alterative for now is for the client to call our own /openai endpoint.
      // NOTE need to consider authentication against games API from a web client
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  // a default editor graph state
  editor.fromJSON({
    id: "demo@0.1.0",
    nodes: {
      1: {
        id: 1,
        data: {},
        inputs: { num1: { connections: [] } },
        outputs: {
          num: { connections: [{ node: 2, input: "num1", data: {} }] },
        },
        position: [-285.5, -105.375],
        name: "Add",
      },
      2: {
        id: 2,
        data: {},
        inputs: {
          num1: { connections: [{ node: 1, output: "num", data: {} }] },
        },
        outputs: { num: { connections: [] } },
        position: [-16.5, -99.375],
        name: "Add",
      },
    },
  });

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");
};

export default editor;
