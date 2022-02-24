import Terminal from 'react-console-emulator'
import { useAuth } from '@/contexts/AuthProvider'

const commands = {
  echo: {
    description: 'Echo a passed string.',
    usage: 'echo <string>',
    fn: function () {
      return `${Array.from(arguments).join(' ')}`
    },
  },
}

const DebugConsole = props => {
  const { user } = useAuth()
  return (
    <Terminal
      commands={commands}
      welcomeMessage={'Welcome to your handy dandy debug console'}
      promptLabel={`${user}@Thoth:~$`}
    />
  )
}

export default DebugConsole
