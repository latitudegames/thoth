import { feathers, feathersUrl } from '@/config'
import { useContext, createContext, useEffect } from 'react'

// import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'

interface FeathersContext {}

const Context = createContext<FeathersContext>({
  socket: null,
})

export const useFeathers = () => useContext(Context)

// Might want to namespace these
const FeathersProvider = ({ children }) => {
  useEffect(() => {
    console.log('fetahers url', feathersUrl)
  }, [])

  const publicInterface: FeathersContext = {}

  // if (!socket) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  if (!feathers) return props.children

  return <FeathersProvider {...props} />
}

export default ConditionalProvider
