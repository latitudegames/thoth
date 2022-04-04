import { sharedb, websocketUrl } from '@/config'
import { useContext, createContext, useEffect, useState } from 'react'

import ReconnectingWebSocket from 'reconnecting-websocket'
import client from 'sharedb/lib/client'
import { Socket } from 'sharedb/lib/sharedb'

const Connection = client.Connection

const Context = createContext({})

export const useSharedb = () => useContext(Context)

// Might want to namespace these
const SharedbProvider = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connection, setConnection] = useState<client.Connection | null>(null)

  useEffect(() => {
    console.log('CONNECTING TO SAHAREDB')
    const _socket = new ReconnectingWebSocket(websocketUrl)
    const _connection = new Connection(_socket as Socket)
    setConnection(_connection)
    setSocket(_socket as Socket)
  }, [])

  const publicInterface = {
    socket,
    connection,
  }

  return <Context.Provider value={publicInterface}>{children}</Context.Provider>
}

const ConditionalProvider = props => {
  console.log('sharedb', sharedb)
  if (!sharedb) return props.children
  return <SharedbProvider {...props} />
}

export default ConditionalProvider
