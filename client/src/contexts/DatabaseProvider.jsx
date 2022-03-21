import { useContext, createContext, useState, useEffect } from 'react'
import { initDB } from '../database'
import LoadingScreen from '../components/LoadingScreen/LoadingScreen'

const Context = createContext(!undefined)

export const useDB = () => useContext(Context)

const DatabaseProvider = ({ children }) => {
  const [db, setDb] = useState(false)
  const [models, setModels] = useState(false)

  useEffect(() => {
    ; (async () => {
      if (db) return

      const { database, models } = await initDB()

      setDb(database)
      setModels(models)
    })()
  }, [db])

  const publicInterface = {
    db,
    models,
  }

  if (!db || !models) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default DatabaseProvider
