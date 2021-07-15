import Rete from "rete";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import TaskPlugin from "./plugins/taskPlugin";
import InspectorPlugin from "./plugins/inspectorPlugin";
import SocketGenerator from "./plugins/socketGenerator";
import { MyNode } from "../../features/common/Node/Node";
import { InputComponent } from "./components/Input";
import { TenseTransformer } from "./components/TenseTransformer";
import { RunInputComponent } from "./components/RunInput";
import { ActionTypeComponent } from "./components/ActionType";
import { ItemTypeComponent } from "./components/ItemDetector";
import { DifficultyDetectorComponent } from "./components/DifficultyDetector";
import { EntityDetector } from "./components/EntityDetector";
import { SafetyVerifier } from "./components/SafetyVerifier";
import { BooleanGate } from "./components/BooleanGate";
import { TimeDetectorComponent } from "./components/TimeDetector";
import { Alert } from "./components/AlertMessage";
import { SwitchGate } from "./components/SwitchGate";
import { PlaytestPrint } from "./components/PlaytestPrint";
import { PlaytestInput } from "./components/PlaytestInput";
import { StateWrite } from "./components/StateWrite";
import { StateRead } from "./components/StateRead";
import { ForEach } from "./components/ForEach";
import { Generator } from "./components/Generator";

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/

let editorInstance;

const editor = async function ({ container, pubSub, thoth }) {
  if (editorInstance) return editorInstance;
  // Here we load up all components of the builder into our editor for usage.
  // We might be able to programatically generate components from enki
  const components = [
    new ActionTypeComponent(),
    new Alert(),
    new BooleanGate(),
    new DifficultyDetectorComponent(),
    new EntityDetector(),
    new ForEach(),
    new Generator(),
    new InputComponent(),
    new ItemTypeComponent(),
    new PlaytestPrint(),
    new PlaytestInput(),
    new RunInputComponent(),
    new SafetyVerifier(),
    new StateWrite(),
    new StateRead(),
    new SwitchGate(),
    new TenseTransformer(),
    new TimeDetectorComponent(),
  ];

  // create the main edtor
  const editor = new Rete.NodeEditor("demo@0.1.0", container);
  editorInstance = editor;

  // Set up the reactcontext pubsub on the editor so rete components can talk to react
  editor.pubSub = pubSub;
  editor.thoth = thoth;

  // PLUGINS
  // https://github.com/retejs/comment-plugin
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

  // This should only be needed on client, not server
  editor.use(SocketGenerator);
  editor.use(InspectorPlugin);

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
      editor.thoth.saveCurrentSpell({graph: editor.toJSON()});
    }
  );

  editor.loadGraph = (graph) => {
    editor.fromJSON(graph);
    editor.view.resize();
    AreaPlugin.zoomAt(editor);
    editor.trigger("process");
  };

  console.log("Loading!");
  editor.loadGraph(thoth.currentSpell.graph);

  return editor;
};

export default editor;
