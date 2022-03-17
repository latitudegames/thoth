# Refactoring

## Notes

- Revert all core components
- move shared components (ie stargate design system) into shared folder for package publication
- organise components into folders for easy visibility into ownership and core functionality
- better use of interfaces. All client completions cant still go direct against latitude
- add dev flags for components not intended for production
- update thoth interface with new functions
- use lattitude API endpoints inside thoth interface
- implement pattern for generating routes from thoth interface as well as using it in in run chains

Possible shared interface pattern between client and server:

```
{
    serverFunction: function
    serverPath: /completion
    clientFunction: function
    handlerWrapper: function(ctx: Koa.Context, serverFunction) => (ctx: Koa.Context) => Promise
}
```

## Development Flow Ideas

- easiest version
  - log in with latitude account, it gets an API key for you and populate syour local DB. Away you go.
  - or can turn off latitude auth, and develop locally with a private API access key.
  - individual components are developed separately in their own packages folder?

## Questions

- How do we ensure package stability? A package of components for usages needs to be stable so when they are pulled into thoth to be used by our end users, they all "just work" on both client and server.
- Stability currently is a very big concern. We need a means by which we can guarantee component functionality.
- We also need to lock down all the "core" systems and only expose a handful of it to external developers. Core code base needs to remain stable for spell interoprability
- exported spells should detail in them their chain depencdencies for what component packages are used.
- if we have the client run against the latitude API directly, we reduce needing of duplicating endpoints in thothserver just to proxy through to latitude API. However that would require users developing to have a latitude account to run our interface for thoth on the client side.
- we could mirror the latitude API in the thoth API and have all client calls first go to thoth server. Might work well.
- Perhaps the real solution here is that all everything latitude related should go through a dedicated interface and no mirror any endpoints?
- how do we allow other plugin components running on the server to use the latitude API from server-side? Need the api key for the user stored in the DB. Or a token override provided. Maybe .env latitude api token overrides the user based on in the DB if it exists?

## Modularization

We will need to have a way for an individual app load the different pieces of itself into the main application. A package would need to provide code for the client, core, and the server.

One proposed pattern, which reflect the data needs of each part of the application to function properly.

```typescript
type ModuleType = {
  appName: 'myApp'
  icon: '.../path/to/icon'
  assets: '../path/to/assets'
  fileType: '*.agent'
  core: {
    components: Record<string, ThothComponent>
    inspectorControls: Record<string, InspectorControl>
    plugins: ThothPlugin[]
    connectors: Recird<string, Connector>
  }
  client: {
    windows: Record<string, WindowComponent>
    events: Record<string, Event>
    inspectorComponents: Record<string, InspectorComponent>
    interface: ThothInterface
    menuBar: Record<string, MenuBar>
    // or maybe this, which would load in all the above itself
    // and expose a single component.
    // Perhaps our client library (or client-core) gives a provider that lets people load these things into thoth from their individual app.
    worksapce: MyAppThothRootComponent
  }
  server: {
    interface: ThothInterface
    // Good for custom routes for the app
    routes: Record<string, RouteDefinition>
  }
}
```

We could allow a given app to provide a 'workspace' for all their windows, managing their 'file type, etc. We give them a workspace comoponent exported from a 'core' library. The workspace would take in a factory function, a default layout, etc. The person would be able to pull in our helper functions, like event handler component, etc to hook into things they need. The workspace component would already be hooked into the pubsub, etc. Perhaps they get them passed in as props when their workspace is rendered.

How do we handle shared state between core (ie thoth node editor) and the plugins? Perhaps each workspace can handle its own state management internally, and we can give the person access to certain portions of core-state maybe?

```jsx
    import {
        Workspace,
        loadInterfaceHook,
        loadComponentsHook,
        loadPluginHook,
        loadEventsHook
    } from '@latitudegames/thoth-client-core'

    const myWorkspace = ({ tabs, pubsub, tab }) => {
        const { loadInterface } = useThothInterface()

        const windowMap = {
            editor: EditorComoponent,
            composer: ComposerComponent
        }

        // How do we add to the interface? Would be great to use a provider that this workspace would in theory have access to...
        loadInterfaceHook(myInterface)

        // We could take care of loading components into core under the hook.  So we just expose a helper method for component loading in core on client.  This would of course be different than on server.
        // This is hard because we would likely have to reinitialize the editor with the new components to have the builder re-render.
        // We may want to have the system load workSpaces early in the application lifecycle so that it is all available once the editor builds the editor.
        // Workspace registrastion would take place in a function of the app inside a provider at the right layer.
        loadComponentsHook(myComponents)

        // We could do something similar for plugins perhaps if we want people to write custom rete plugins?
        // Big problem with this is the laod order of plugins makeas a big difference to behaviour (sometimes)
        loadPluginHook(myRetePlugin)

        // events could be an events config, or perhaps a full components with null render if someone wants to hook into other parts of their code and the context and state life cycle.
        loadEvents(myEvents)

        // high level workspace component that we provide to them?
        return <Workspace windowMap={windowMap} menuBarConfig={myMenuBar}>
    }

```
