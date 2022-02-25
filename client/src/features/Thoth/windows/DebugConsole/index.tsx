import { useState, useCallback, useEffect, useRef } from 'react'
import Terminal from 'react-console-emulator'
import { useAuth } from '@/contexts/AuthProvider'
import { usePubSub } from '@/contexts/PubSubProvider'

export type DebugMessage = {
  message: string
}

const DebugConsole = ({ tab }) => {
  const { user } = useAuth()
  const { publish, subscribe, events } = usePubSub()
  const { $DEBUG_INPUT, $DEBUG_PRINT } = events

  const [messages, setMessages] = useState<DebugMessage[]>([])
  const terminalRef = useRef()

  const printToDebugger = useCallback(
    (_, message) => {
      const newMessages = [...messages, message]
      setMessages(newMessages)
      const terminal = terminalRef.current
      terminal &&
        (terminal as unknown as { pushToStdout: any }).pushToStdout(
          `> ${messages}`
        )
    },
    [messages]
  )

  useEffect(() => {
    const unsubscribe = subscribe($DEBUG_PRINT(tab.id), printToDebugger)

    return unsubscribe
  }, [subscribe, printToDebugger, $DEBUG_PRINT])

  /**
   * Terminal commands
   */
  const commands = {
    echo: {
      description: 'Echo a passed string.',
      usage: 'echo <string>',
      fn: function () {
        return `${Array.from(arguments).join(' ')}`
      },
    },
  }
  // https://github.com/linuswillner/react-console-emulator/tree/e2b602f631e8b7c57c4a7407491cbfb84f357519
  return (
    <Terminal
      ref={terminalRef}
      commands={commands}
      promptLabel={`${user.id}@Thoth:~$`}
      // readOnly={true}
    />
  )
}

export default DebugConsole
