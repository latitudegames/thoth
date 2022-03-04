import { useContext, createContext, useState, useEffect } from 'react'
import { initDB } from '../database'
import LoadingScreen from '../features/common/LoadingScreen/LoadingScreen'
import { ModuleModal } from '@/database/models/moduleModel'

interface ContextType {
  db: {}
  models: {}
  modules?: ModuleModal[] | ModuleModal
}

const Context = createContext<ContextType>({
  db: {},
  models: {},
  modules: [] as ModuleModal[],
})

export const useDB = () => useContext(Context)

const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(false)
  const [models, setModels] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (db) return

      const { database, models } = await initDB()

      setDb(database)
      setModels(models)
    })()
  }, [db])

  const publicInterface = {
    db,
    models,
    // modules
  }

  if (!db || !models) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default DatabaseProvider
