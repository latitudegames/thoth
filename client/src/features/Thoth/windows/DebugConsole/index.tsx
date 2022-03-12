import { useCallback, useEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import Terminal from 'react-console-emulator'
import { useAuth } from '@/contexts/AuthProvider'
import { usePubSub } from '@/contexts/PubSubProvider'
import Window from '@/features/common/Window/Window'

export type DebugMessage = {
  message: string
}

interface Terminal {
  pushToStdout: any
}

const DebugConsole = ({ tab }) => {
  const [scrollToBottom, setScrollToBottom] = useState<boolean>(false)
  const { user } = useAuth()
  const {
    //  publish,
    subscribe,
    events,
  } = usePubSub()
  const {
    //  $DEBUG_INPUT,
    $DEBUG_PRINT,
  } = events

  const terminalRef = useRef<Terminal>()

  const scroll = () => {
    setScrollToBottom(false)
    setScrollToBottom(true)
  }

  const formatErrorMessage = message =>
    `> Node ${message.nodeId}: Error in ${message.from} component ${
      message.name ?? 'unnamed'
    }.`

  const formatLogMessage = message =>
    `> Node ${message.nodeId}: Message from ${message.from} component ${
      message.name ?? 'unnamed'
    }.`

  const ErrorMessage = message => (
    <div style={{ lineHeight: '21px', color: 'var(--red)' }}>
      <p style={{ margin: 0 }}>{formatErrorMessage(message)}</p>
      <p style={{ margin: 0 }}>Error message: ${message.errorMessage}</p>
      <br />
    </div>
  )

  const LogMessage = message => (
    <div style={{ lineHeight: '21px', color: 'var(--green)' }}>
      <p style={{ margin: 0 }}>{formatLogMessage(message)}</p>
      <p style={{ margin: 0 }}>${message.content}</p>
      <br />
    </div>
  )

  const getMessage = message => {
    if (message.type === 'error') return renderToString(ErrorMessage(message))
    if (message.type === 'log') return renderToString(LogMessage(message))
  }

  const printToDebugger = useCallback((_, message) => {
    const terminal = terminalRef.current
    if (!terminal) return

    const msg = getMessage(message)

    terminal.pushToStdout(msg)

    scroll()
  }, [])

  const commandCallback = () => {
    scroll()
  }

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
    <Window scrollToBottom={scrollToBottom}>
      <Terminal
        ref={terminalRef}
        commands={commands}
        dangerMode={true}
        commandCallback={commandCallback}
        noNewlineParsing={true}
        promptLabel={`${user?.id}@Thoth:~$`}
        // readOnly={true}
        style={{
          overflow: 'hidden',
          minHeight: '100%',
          maxHeight: 'initial',
          // height: '100%',
        }}
        messageStyle={{ color: 'red' }}
      />
    </Window>
  )
}

export default DebugConsole
