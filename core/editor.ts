import { NodeEditor } from "rete";
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

import { initSharedEngine } from "./engine"
import { components} from "./components/components"
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

const editor = async function ({ container, pubSub, thoth, tab, thothV2, node }: { container: any, pubSub: any, thoth: any, tab: any, thothV2: any, node: any}) {
  if (editorTabMap[tab.id]) editorTabMap[tab.id].clear();

  let modules = [];

  // create the main edtor
  const editor = new ThothEditor("demo@0.1.0", container);

  editorTabMap[tab.id] = editor;



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
    // this component parameter is a custom default style for nodes
    component: node,
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
  // We will need a way to share components between client and server (@seang: this should be covered by upcoming package)
  // WARNING all the plugins from the editor get installed onto the component and modify it.  This effects the components registered in the engine, which already have plugins installed.
  components.forEach((c) => {
    editor.register(c);
  });

  // The engine is used to process/run the rete graph
  const engine = initSharedEngine("demo@0.1.0", modules, components)
  // @seang TODO: update types for editor.use rather than casting as unknown here, we may want to bring our custom rete directly into the monorepo at this point 
  editor.use(ModulePlugin, { engine, modules } as unknown as void);
  // @seang: moved these two functions to attempt to preserve loading order after the introduction of initSharedEngine
  editor.on("zoom", ({ source }) => {
    return source !== "dblclick";
  });

  editor.bind("run");
  editor.bind("save");

  editor.on(
    "process nodecreated noderemoved connectioncreated connectionremoved",
    async () => {
      // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
      // Then we run the fewshots, etc on the backend rather than on the client.
      // Alternative for now is for the client to call our own /openai endpoint.
      // NOTE need to consider authentication against Latitude API from a web client
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