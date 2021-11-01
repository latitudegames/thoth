import { useLayout } from '@thoth/contexts/LayoutProvider'

const CodeControl = () => {
  const { createOrFocus, windowTypes } = useLayout()

  const onClick = () => {
    createOrFocus(windowTypes.TEXT_EDITOR, 'Text Editor')
  }

  return <button onClick={onClick}>Edit code in editor</button>
}

export default CodeControl
