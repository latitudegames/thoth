import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import { MyNode } from "../components/Node";
import { InputComponent } from "./components/InputComponent";

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/
const editor = async function (container) {
  // Here we load up all components of the builder into our editor for usage.
  // We might be able to programatically generate components from enki
  const components = [new InputComponent()];

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
  // We will need a wa to share components between client and server
  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  // List for changes to the editor.  When they are detected, run the graph in the engine
  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
      // Then we run the fewshots, etc on the backend rather than on the client.
      // Alterative for now is for the client to call our own /openai endpoint.
      // NOTE need to consider authentication against games API from a web client
      await engine.abort();
      await engine.process(editor.toJSON());
    }
  );

  const defaultState =
    '{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{"text":"Your action here"},"inputs":{},"outputs":{"text":{"connections":[]}},"position":[-628.0219116210938,-141.3781280517578],"name":"Input"}}}';

  // a default editor graph state
  editor.fromJSON(JSON.parse(defaultState));

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");

  return editor;
};

export default editor;
