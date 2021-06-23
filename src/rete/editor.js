import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import TaskPlugin from "rete-task-plugin";
import AreaPlugin from "rete-area-plugin";
import { MyNode } from "../components/Node";
import { InputComponent } from "./components/InputComponent";
import { TenseTransformer } from "./components/TenseTransformer";
import { RunInputComponent } from "./components/RunInputComponent";
import { ActionTypeComponent } from "./components/ActionType";
import { EntityDetector } from "./components/EntityDetector";
import { SafetyVerifier } from "./components/SafetyVerifier";
import { BooleanGate } from "./components/BooleanGate";

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
    new ActionTypeComponent(),
    new EntityDetector(),
    new SafetyVerifier(),
    new BooleanGate(),
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

  editor.use(TaskPlugin);

  // The engine is used to process/run the rete graph
  const engine = new Rete.Engine("demo@0.1.0");

  // Register custom components with both the editor and the engine
  // We will need a wa to share components between client and server
  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  editor.on("zoom", ({ source }) => {
    return source !== "dblclick";
  });

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
    '{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{"text":"Input text","undefined":"Sam"},"inputs":{},"outputs":{"text":{"connections":[{"node":2,"input":"name","data":{}},{"node":7,"input":"name","data":{}},{"node":8,"input":"name","data":{}}]}},"position":[-584.6937240633796,0.21663434116217672],"name":"Input"},"2":{"id":2,"data":{},"inputs":{"data":{"connections":[{"node":4,"output":"data","data":{}}]},"text":{"connections":[{"node":4,"output":"text","data":{}}]},"name":{"connections":[{"node":1,"output":"text","data":{}}]}},"outputs":{"action":{"connections":[{"node":5,"input":"action","data":{}}]},"data":{"connections":[{"node":5,"input":"data","data":{}}]}},"position":[-258.40411111574474,-95.36187171688155],"name":"Tense Transformer"},"4":{"id":4,"data":{"undefined":"I walk into the room","text":"Input text"},"inputs":{},"outputs":{"data":{"connections":[{"node":2,"input":"data","data":{}}]},"text":{"connections":[{"node":2,"input":"text","data":{}},{"node":7,"input":"text","data":{}},{"node":8,"input":"text","data":{}}]}},"position":[-582.4164977964898,-205.11553029720008],"name":"Input with run"},"5":{"id":5,"data":{},"inputs":{"action":{"connections":[{"node":2,"output":"action","data":{}}]},"data":{"connections":[{"node":2,"output":"data","data":{}}]}},"outputs":{"boolean":{"connections":[{"node":6,"input":"boolean","data":{}}]},"data":{"connections":[{"node":6,"input":"data","data":{}}]}},"position":[136.71001449014577,-203.88432719218048],"name":"Safety Verifier"},"6":{"id":6,"data":{},"inputs":{"boolean":{"connections":[{"node":5,"output":"boolean","data":{}}]},"data":{"connections":[{"node":5,"output":"data","data":{}}]}},"outputs":{"true":{"connections":[{"node":7,"input":"data","data":{}}]},"false":{"connections":[{"node":8,"input":"data","data":{}}]}},"position":[522.5284937856222,-273.4006765840502],"name":"Boolean Gate"},"7":{"id":7,"data":{},"inputs":{"data":{"connections":[{"node":6,"output":"true","data":{}}]},"text":{"connections":[{"node":4,"output":"text","data":{}}]},"name":{"connections":[{"node":1,"output":"text","data":{}}]}},"outputs":{"action":{"connections":[]},"data":{"connections":[]}},"position":[824.4693831854775,-480.7339922525906],"name":"Tense Transformer"},"8":{"id":8,"data":{},"inputs":{"data":{"connections":[{"node":6,"output":"false","data":{}}]},"text":{"connections":[{"node":4,"output":"text","data":{}}]},"name":{"connections":[{"node":1,"output":"text","data":{}}]}},"outputs":{"action":{"connections":[]},"data":{"connections":[]}},"position":[818.1862278206048,-150.4088675639029],"name":"Tense Transformer"}}}';

  // a default editor graph state
  editor.fromJSON(JSON.parse(defaultState));

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");

  return editor;
};

export default editor;
