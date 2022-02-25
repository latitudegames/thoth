import Terminal from 'react-console-emulator'
import { useAuth } from '@/contexts/AuthProvider'
import { usePubSub } from '@/contexts/PubSubProvider'

export type DebugMessage = {
  message: string
}

const DebugConsole = ({ tab }) => {

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
