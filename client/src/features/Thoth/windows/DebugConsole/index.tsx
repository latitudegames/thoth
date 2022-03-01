import { useCallback, useEffect, useRef, useState } from 'react'
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

  const printToDebugger = useCallback((_, data) => {
    const terminal = terminalRef.current
    if (!terminal) return

    terminal.pushToStdout(
      `
      > Error in ${data.errorIn} component.
      > ${data.errorMessage}
      `
    )

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
        commandCallback={commandCallback}
        promptLabel={`${user.id}@Thoth:~$`}
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
