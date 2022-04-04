import { sharedb } from '@/config'
import { useContext, createContext } from 'react'

const Context = createContext({})

export const useSharedb = () => useContext(Context)

// Might want to namespace these
const PubSubProvider = ({ children }) => {
  const publicInterface = {}

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = ({ children }) => {
  if (!sharedb) return <>{children}</>

  return PubSubProvider
}

export default ConditionalProvider
