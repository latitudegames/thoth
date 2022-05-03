import feathers from '@feathersjs/client'
import io from 'socket.io-client'
import { useContext, createContext, useEffect, useState } from 'react'

import { feathers as feathersFlag, feathersUrl } from '@/config'
import auth from 'feathers-authentication-client'
import { Application } from '@feathersjs/feathers'

import LoadingScreen from '@/components/LoadingScreen/LoadingScreen'
import { getAuthHeader } from './AuthProvider'

const buildFeathersClient = () => {
  const feathersClient = feathers()
  const authHeaders = getAuthHeader()

  const socket = io(feathersUrl, {
    withCredentials: true,
    transports: ['websocket'],
    // Send the authorization header in the initial connection request
    extraHeaders: authHeaders,
  })
  feathersClient.configure(feathers.socketio(socket, { timeout: 10000 }))
  feathersClient.configure(auth())

  return feathersClient
}

interface FeathersContext {
  client: Application<any> | null
}

const Context = createContext<FeathersContext>(undefined!)

export const useFeathers = () => useContext(Context)

// Might want to namespace these
const FeathersProvider = ({ children }) => {
  const [client, setClient] = useState<FeathersContext['client']>(null)
  useEffect(() => {
    const client = buildFeathersClient()
    setClient(client)
  }, [])

  const publicInterface: FeathersContext = {
    client,
  }

  if (!client) return <LoadingScreen />

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  if (!feathersFlag) return props.children

  return <FeathersProvider {...props} />
}

export default ConditionalProvider
