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
import { Alert } from "./components/AlertMessage";

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
    new Alert(),
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
    '{"id":"demo@0.1.0","nodes":{"1":{"id":1,"data":{"text":"joe","undefined":"Sam"},"inputs":{},"outputs":{"text":{"connections":[{"node":12,"input":"name","data":{}}]}},"position":[74.40924045994934,79.08276852760682],"name":"Input"},"4":{"id":4,"data":{"undefined":"I walk into the room","text":"walk into the bar"},"inputs":{},"outputs":{"data":{"connections":[{"node":9,"input":"data","data":{}}]},"text":{"connections":[{"node":9,"input":"string","data":{}},{"node":12,"input":"text","data":{}}]}},"position":[-600.4485862926254,-194.29157645473776],"name":"Input with run"},"9":{"id":9,"data":{"display":"true"},"inputs":{"string":{"connections":[{"node":4,"output":"text","data":{}}]},"data":{"connections":[{"node":4,"output":"data","data":{}}]}},"outputs":{"boolean":{"connections":[{"node":11,"input":"boolean","data":{}}]},"data":{"connections":[{"node":11,"input":"data","data":{}}]}},"position":[-199.3843239822832,-205.0910954299351],"name":"Safety Verifier"},"11":{"id":11,"data":{},"inputs":{"boolean":{"connections":[{"node":9,"output":"boolean","data":{}}]},"data":{"connections":[{"node":9,"output":"data","data":{}}]}},"outputs":{"true":{"connections":[{"node":12,"input":"data","data":{}}]},"false":{"connections":[]}},"position":[84.56760681516351,-201.73268915627742],"name":"Boolean Gate"},"12":{"id":12,"data":{"display":"Joe walks into the bar."},"inputs":{"data":{"connections":[{"node":11,"output":"true","data":{}}]},"text":{"connections":[{"node":4,"output":"text","data":{}}]},"name":{"connections":[{"node":1,"output":"text","data":{}}]}},"outputs":{"action":{"connections":[]},"data":{"connections":[]}},"position":[426.32063666846057,-244.95964440421992],"name":"Tense Transformer"}}}';

  // a default editor graph state
  editor.fromJSON(JSON.parse(defaultState));

  editor.view.resize();
  AreaPlugin.zoomAt(editor);
  editor.trigger("process");

  return editor;
};

export default editor;
