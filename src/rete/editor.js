import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import { MyNode } from "../components/Node";
import { InputComponent } from "./components/InputComponent";
import { TenseTransformer } from "./components/TenseTransformer";
import { RunInputComponent } from "./components/RunInputComponent";

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/
const editor = async function (container) {
  // Here we load up all components of the builder into our editor for usage.
  // We might be able to programatically generate components from enki
  const components = [
    new InputComponent(),
    new TenseTransformer(),
    new RunInputComponent(),
  ];

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
  editor.on("process", async () => {
    // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
    // Then we run the fewshots, etc on the backend rather than on the client.
    // Alterative for now is for the client to call our own /openai endpoint.
    // NOTE need to consider authentication against games API from a web client
    await engine.abort();
    await engine.process(editor.toJSON());
  });

  const defaultState =
    '{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{"text":"Your action here","undefined":"Sam"},"inputs":{},"outputs":{"text":{"connections":[{"node":2,"input":"name","data":{}}]}},"position":[-584.6937240633796,0.21663434116217672],"name":"Input"},"2":{"id":2,"data":{},"inputs":{"text":{"connections":[{"node":4,"output":"text","data":{}}]},"name":{"connections":[{"node":1,"output":"text","data":{}}]}},"outputs":{"action":{"connections":[]}},"position":[-258.40411111574474,-95.36187171688155],"name":"Tense Transformer"},"4":{"id":4,"data":{"undefined":"I walk into the room"},"inputs":{},"outputs":{"text":{"connections":[{"node":2,"input":"text","data":{}}]}},"position":[-581.868571648038,-184.57681808772452],"name":"Input with run"}}}';

  // a default editor graph state
  editor.fromJSON(JSON.parse(defaultState));

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");

  return editor;
};

export default editor;
