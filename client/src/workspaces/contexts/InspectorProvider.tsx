import { createContext, useContext } from 'react'

type InspectorContext = {}

const Context = createContext<InspectorContext>(undefined!)

export const useInspector = () => useContext(Context)

const InspectorProvider = ({ children }) => {
  const publicInterface: InspectorContext = {}

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

export default InspectorProvider
