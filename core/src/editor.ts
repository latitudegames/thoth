import { NodeEditor } from 'rete'
import ConnectionPlugin from 'rete-connection-plugin'
import ConnectionReroutePlugin from 'rete-connection-reroute-plugin'
import ContextMenuPlugin from 'rete-context-menu-plugin'
import ReactRenderPlugin from 'rete-react-render-plugin'
import { Data } from 'rete/types/core/data'

import { EventsTypes, ModuleType } from '../types'
import { getComponents } from './components/components'
import { EngineContext, initSharedEngine } from './engine'
import AreaPlugin from './plugins/areaPlugin'
import DebuggerPlugin from './plugins/debuggerPlugin'
import DisplayPlugin from './plugins/displayPlugin'
// import HistoryPlugin from './plugins/historyPlugin'
import InspectorPlugin from './plugins/inspectorPlugin'
import LifecyclePlugin from './plugins/lifecyclePlugin'
import ModulePlugin from './plugins/modulePlugin'
import { ModuleManager } from './plugins/modulePlugin/module-manager'
import SocketGenerator from './plugins/socketGenerator'
import TaskPlugin from './plugins/taskPlugin'
import { PubSubContext, ThothComponent } from './thoth-component'
export class ThothEditor extends NodeEditor<EventsTypes> {
  pubSub: PubSubContext
  thoth: EngineContext
  tab: { type: string }
  abort: unknown
  loadGraph: (graph: Data) => Promise<void>
  moduleManager: ModuleManager
}

/*
  Primary initialization function.  Takes a container ref to attach the rete editor to.
*/

const editorTabMap: Record<string, ThothEditor> = {}

export const initEditor = async function ({
  container,
  pubSub,
  thoth,
  tab,
  node,
}: {
  container: any
  pubSub: any
  thoth: any
  tab: any
  node: any
}) {
  if (editorTabMap[tab.id]) editorTabMap[tab.id].clear()

  const components = getComponents()

  // create the main edtor
  const editor = new ThothEditor('demo@0.1.0', container)

  editorTabMap[tab.id] = editor

  // Set up the reactcontext pubsub on the editor so rete components can talk to react
  editor.pubSub = pubSub
  editor.thoth = thoth
  editor.tab = tab

  // ██████╗ ██╗     ██╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
  // ██╔══██╗██║     ██║   ██║██╔════╝ ██║████╗  ██║██╔════╝
  // ██████╔╝██║     ██║   ██║██║  ███╗██║██╔██╗ ██║███████╗
  // ██╔═══╝ ██║     ██║   ██║██║   ██║██║██║╚██╗██║╚════██║
  // ██║     ███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║███████║
  // ╚═╝     ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝

  // History plugin for undo/redo
  // editor.use(HistoryPlugin, { keyboard: false })

  // PLUGINS
  // https://github.com/retejs/comment-plugin
  // connection plugin is used to render conections between nodes
  editor.use(ConnectionPlugin)
  // @seang: temporarily disabling because dependencies of ConnectionReroutePlugin are failing validation on server import of thoth-core
  editor.use(ConnectionReroutePlugin)

  // React rendering for the editor
  editor.use(ReactRenderPlugin, {
    // this component parameter is a custom default style for nodes
    component: node as { contextMenuName: string; name: string },
  })
  // renders a context menu on right click that shows available nodes
  editor.use(LifecyclePlugin)
  editor.use(ContextMenuPlugin, {
    delay: 0,
    rename(component: { contextMenuName: any; name: any }) {
      return component.contextMenuName || component.name
    },
    allocate: (component: ThothComponent<unknown>) => {
      //@seang: disabling component filtering in anticipation of needing to treat spells as "top level modules" in the publishing workflow
      const tabType = editor.tab.type
      const { workspaceType } = component

      if (component.deprecated) return null
      if (workspaceType && workspaceType !== tabType) return null
      return [component.category]
    },
  })

  // This should only be needed on client, not server
  editor.use(SocketGenerator)
  editor.use(DisplayPlugin)
  editor.use(InspectorPlugin)
  editor.use(AreaPlugin, {
    scaleExtent: { min: 0.25, max: 2 },
  })

  const moduleDocs = await thoth.getModules()

  // Parse modules into dictionary of all modules and JSON values
  const modules: Record<string, ModuleType> = moduleDocs
    .map((doc: { toJSON: Function }) => doc.toJSON())
    .reduce((acc: Record<string, ModuleType>, module: ModuleType) => {
      // todo handle better mapping
      // see moduleSelect.tsx
      acc[module.name] = module
      return acc
    }, {} as Record<string, ModuleType>)

  // The engine is used to process/run the rete graph

  const engine = initSharedEngine({
    name: 'demo@0.1.0',
    components,
    server: false,
    modules: {},
  })
  // @seang TODO: update types for editor.use rather than casting as unknown here, we may want to bring our custom rete directly into the monorepo at this point

  // WARNING: ModulePlugin needs to be initialized before TaskPlugin during engine setup
  editor.use(DebuggerPlugin)
  editor.use(ModulePlugin, { engine, modules } as unknown as void)
  editor.use(TaskPlugin)

  // ███╗   ███╗ ██████╗ ██████╗ ██╗   ██╗██╗     ███████╗███████╗
  // ████╗ ████║██╔═══██╗██╔══██╗██║   ██║██║     ██╔════╝██╔════╝
  // ██╔████╔██║██║   ██║██║  ██║██║   ██║██║     █████╗  ███████╗
  // ██║╚██╔╝██║██║   ██║██║  ██║██║   ██║██║     ██╔══╝  ╚════██║
  // ██║ ╚═╝ ██║╚██████╔╝██████╔╝╚██████╔╝███████╗███████╗███████║
  // ╚═╝     ╚═╝ ╚═════╝ ╚═════╝  ╚═════╝ ╚══════╝╚══════╝╚══════╝

  // add initial modules to the module manager
  editor.moduleManager.setModules(modules)

  // listen for pubsub onAddModule event to add modules
  thoth.onAddModule((module: ModuleType) => {
    editor.moduleManager.addModule(module)
  })

  // listen for update module event to update a module
  thoth.onUpdateModule((module: ModuleType) => {
    editor.moduleManager.updateModule(module)
  })

  thoth.onDeleteModule((module: ModuleType) => {
    editor.moduleManager.deleteModule(module)
  })

  // WARNING all the plugins from the editor get installed onto the component and modify it.  This effects the components registered in the engine, which already have plugins installed.
  components.forEach(c => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    // the problematic type here is coming directly from node modules, we may need to revisit further customizing the Editor Register type expectations or it's class
    editor.register(c)
  })

  // @seang: moved these two functions to attempt to preserve loading order after the introduction of initSharedEngine
  editor.on('zoom', ({ source }) => {
    return source !== 'dblclick'
  })

  editor.bind('run')
  editor.bind('save')

  editor.on('process', async () => {
    // Here we would swap out local processing for an endpoint that we send the serialised JSON too.
    // Then we run the fewshots, etc on the backend rather than on the client.
    // Alternative for now is for the client to call our own /openai endpoint.
    // NOTE need to consider authentication against Latitude API from a web client
    await engine.abort()
    await engine.process(editor.toJSON(), null, { thoth: thoth })
  })

  // ██████╗ ██╗   ██╗██████╗ ██╗     ██╗ ██████╗
  // ██╔══██╗██║   ██║██╔══██╗██║     ██║██╔════╝
  // ██████╔╝██║   ██║██████╔╝██║     ██║██║
  // ██╔═══╝ ██║   ██║██╔══██╗██║     ██║██║
  // ██║     ╚██████╔╝██████╔╝███████╗██║╚██████╗
  // ╚═╝      ╚═════╝ ╚═════╝ ╚══════╝╚═╝ ╚═════╝

  editor.abort = async () => {
    await engine.abort()
  }

  editor.loadGraph = async (_graph: Data) => {
    const graph = JSON.parse(JSON.stringify(_graph))
    await engine.abort()
    editor.fromJSON(graph)
    editor.view.resize()
    AreaPlugin.zoomAt(editor)
  }
  return editor
}
