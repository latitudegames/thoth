import { useSnackbar } from 'notistack'
import { useContext, createContext, useState, useEffect } from 'react'

import { useDB } from './DatabaseProvider'
import { usePubSub } from './PubSubProvider'

const Context = createContext({
  modules: [] as any[],
  saveModule: () => {},
  getModule: () => {},
  getSpellModules: () => {},
} as any)

export const useModule = () => useContext(Context)

const ModuleProvider = ({ children }) => {
  const [modules, setModules] = useState([] as any[])

  const { events, publish, subscribe } = usePubSub()
  const { enqueueSnackbar } = useSnackbar()
  const { models } = useDB()

  const { ADD_MODULE, UPDATE_MODULE, $MODULE_UPDATED } = events

  // Subscribe to all general update module events
  // and relay them to the individual module name subscribers
  useEffect(() => {
    return subscribe(UPDATE_MODULE, (event, module) => {
      publish($MODULE_UPDATED(module.id), module)
    })
  }, [])

  // subscribe to all modules in the database
  useEffect(() => {
    if (!models) return
    let subscription
    ;(async () => {
      subscription = await models.modules.getModules(results => {
        if (!results) return
        setModules(results.map(module => module.toJSON()) as any[])
      })
    })()

    return () => {
      if (subscription.unsubscribe) subscription.unsubscribe()
    }
  }, [models])

  const saveModule = async (moduleId, update, snack = true) => {
    try {
      const module = await models.modules.updateModule(moduleId, update)
      if (snack) enqueueSnackbar('Module saved')

      const json = module.toJSON()

      publish(UPDATE_MODULE, json)

      return module
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn('error saving module', module)
      if (snack) enqueueSnackbar('Error saving module')
    }
  }

  const newModule = async moduleOptions => {
    const module = await models.modules.newModule(moduleOptions)
    publish(ADD_MODULE, module.toJSON())

    return module
  }

  const getModule = async moduleId => {
    const model = await models.modules.findOneModule({ id: moduleId })
    return model
  }

  const getSpellModules = async spell => {
    // should actually look for spells that have a data.module key set to a string
    const moduleIds = Object.values(spell.graph.nodes)
      .filter((n: any) => n.name === 'Module')
      .map((n: any) => n.data.id)

    const moduleDocs = await Promise.all(
      moduleIds.map(moduleId => getModule(moduleId))
    )

    return moduleDocs.map(module => module.toJSON())
  }

  const publicInterface = {
    ...models.modules,
    modules,
    saveModule,
    getModule,
    getSpellModules,
    newModule,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default ModuleProvider
