import Rete, { NodeEditor } from "rete";
import { EventsTypes as DefaultEventsTypes } from "rete/types/events";

import isEqual from "lodash/isEqual";
import ReactRenderPlugin from "rete-react-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import HistoryPlugin from "./plugins/historyPlugin";
import LifecyclePlugin from "./plugins/lifecyclePlugin";
import AreaPlugin from "./plugins/areaPlugin";
import TaskPlugin from "./plugins/taskPlugin";
import InspectorPlugin from "./plugins/inspectorPlugin";
import SocketGenerator from "./plugins/socketGenerator";
import DisplayPlugin from "./plugins/displayPlugin";
import ModulePlugin from "./plugins/modulePlugin";

import { MyNode } from "../common/Node/Node";
import { InputComponent } from "./components/Input";
import { JoinListComponent } from "./components/JoinList";
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
import { StringProcessor } from "./components/StringProcessor";
import { ForEach } from "./components/ForEach";
import { EnkiTask } from "./components/EnkiTask";
import { Generator } from "./components/Generator";
import { RawGenerator } from "./components/RawGenerator";
import { ResponseToText } from "./components/ResponseToText";
import { ArrayToItems } from "./components/ArrayToItems";
import { ResponseToCompletions } from "./components/ResponseToCompletions";
import { Code } from "./components/Code";
import { ModuleComponent } from "./components/Module";
import { ModuleInput } from "./components/ModuleInput";
import { ModuleOutput } from "./components/ModuleOutput";
import { ModuleTriggerOut } from "./components/ModuleTriggerOut";
import { ModuleTriggerIn } from "./components/ModuleTriggerIn";
import { HuggingfaceComponent } from "./components/Huggingface";
import { ProseToScript } from "./components/ProseToScript";
import { Condition } from "./components/Condition";

interface EventsTypes extends DefaultEventsTypes {
  run: void;
  save: void;
  [key: string]: any;
}

class ThothEditor extends NodeEditor<EventsTypes> {
  pubSub;
  thoth;
  thothV2;
  tab;
  abort;
  loadGraph;
  moduleSubscription;
  moduleManager;
}

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/

let editorTabMap = {};

const editor = async function ({ container, pubSub, thoth, tab, thothV2 }) {
  if (editorTabMap[tab.id]) editorTabMap[tab.id].clear();
  // Here we load up all components of the builder into our editor for usage.
  // We might be able to programatically generate components from enki
  const components = [
    new ActionTypeComponent(),
    new Alert(),
    new BooleanGate(),
    new Code(),
    new DifficultyDetectorComponent(),
    new EnkiTask(),
    new EntityDetector(),
    new ForEach(),
    new Generator(),
    new HuggingfaceComponent(),
    new InputComponent(),
    new ItemTypeComponent(),
    new JoinListComponent(),
    new ModuleComponent(),
    new ModuleInput(),
    new ModuleOutput(),
    new ModuleTriggerOut(),
    new ModuleTriggerIn(),
    new PlaytestPrint(),
    new PlaytestInput(),
    new RunInputComponent(),
    new SafetyVerifier(),
    new StateWrite(),
    new StateRead(),
    new StringProcessor(),
    new SwitchGate(),
    new TenseTransformer(),
    new TimeDetectorComponent(),
    new ProseToScript(),
    new RawGenerator(),
    new ResponseToText(),
    new ResponseToCompletions(),
    new ArrayToItems(),
    new Condition(),
  ];

  let modules = [];

  // create the main edtor
  const editor = new ThothEditor("demo@0.1.0", container);

  editorTabMap[tab.id] = editor;

  // The engine is used to process/run the rete graph
  const engine = new Rete.Engine("demo@0.1.0");

  // Set up the reactcontext pubsub on the editor so rete components can talk to react
  editor.pubSub = pubSub;
  editor.thoth = thoth;
  editor.thothV2 = thothV2;
  editor.tab = tab;

  // History plugin for undo/redo
  editor.use(HistoryPlugin, { keyboard: false });

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
  editor.use(LifecyclePlugin);
  editor.use(ContextMenuPlugin, {
    delay: 0,
    rename(component) {
      return component.contextMenuName || component.name;
    },
    allocate: (component) => {
      const tabType = component.editor.tab.type;
      const { workspaceType } = component;

      if (workspaceType && workspaceType !== tabType) return null;
      return [component.category];
    },
  });
  editor.use(ModulePlugin, { engine, modules });
  editor.use(TaskPlugin);

  // This should only be needed on client, not server
  editor.use(SocketGenerator);
  editor.use(DisplayPlugin);
  editor.use(InspectorPlugin);
  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.25, max: 2 },
  });

  // handle modules
  // NOTE watch this subscription as it may get intensive with lots of tabs open...
  editor.moduleSubscription = await thothV2.getModules((moduleDocs) => {
    if (!moduleDocs) return;

    modules = moduleDocs
      .map((doc) => doc.toJSON())
      .reduce((acc, module) => {
        // todo handle better mapping
        // see moduleSelect.tsx
        acc[module.name] = module;
        return acc;
      }, {});

    // we only want to proceed if the incoming modules have changed.
    if (isEqual(modules, editor.moduleManager.modules)) return;
    editor.moduleManager.setModules(modules);
    editor.trigger("save");
  });

  // Register custom components with both the editor and the engine
  // We will need a wa to share components between client and server
  // WARNING all the plugins from the editor get installed onto the component and modify it.  This effects the components registered in the engine, which already have plugins installed.
  components.forEach((c) => {
    editor.register(c);
    engine.register(c);
  });

  editor.on("zoom", ({ source }) => {
    return source !== "dblclick";
  });

  editor.bind("run");
  editor.bind("save");
  engine.bind("run");

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
      // Then we run the fewshots, etc on the backend rather than on the client.
      // Alterative for now is for the client to call our own /openai endpoint.
      // NOTE need to consider authentication against games API from a web client
      await engine.abort();
      await engine.process(editor.toJSON(), null, { thoth: thothV2 });
    }
  );

  editor.abort = async () => {
    await engine.abort();
  };

  editor.loadGraph = async (graph) => {
    await engine.abort();
    editor.fromJSON(graph);
    editor.view.resize();
    AreaPlugin.zoomAt(editor);
  };

  return editor;
};

export default editor;
