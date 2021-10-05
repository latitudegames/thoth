import Editor from '@monaco-editor/react'
import jsonFormat from 'json-format'
import { useSnackbar } from 'notistack'
import { useState, useEffect } from 'react'

import { useSpell } from '../../../contexts/SpellProvider'
import Window from '../../common/Window/Window'

import '../thoth.module.css'

const StateManager = props => {
  const { currentSpell, rewriteCurrentGameState } = useSpell()
  const { enqueueSnackbar } = useSnackbar()
  const [typing, setTyping] = useState(null)
  const [code, setCode] = useState('{}')
  const [height, setHeight] = useState()

  const bottomHeight = 50

  const editorOptions = {
    lineNumbers: false,
    minimap: {
      enabled: false,
    },
    fontSize: 14,
    suggest: {
      preview: false,
    },
  }

  const handleEditorWillMount = monaco => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#272727',
      },
    })
  }

  useEffect(() => {
    if (props?.node?.rect?.height)
      setHeight(props.node.rect.height - bottomHeight)

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener('resize', data => {
      setTimeout(() => setHeight(data.rect.height - bottomHeight), 0)
    })
  }, [props.node])

  useEffect(() => {
    if (!typing) return

    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      onSave()
      setTyping(false)
    }, 2000)

    return () => clearTimeout(delayDebounceFn)
  }, [code])

  useEffect(() => {
    if (currentSpell?.gameState) setCode(jsonFormat(currentSpell.gameState))
  }, [currentSpell])

  const onClear = () => {
    const reset = `{}`
    setCode(reset)
  }

  const onChange = code => {
    setCode(code)
    setTyping(true)
  }

  const onSave = () => {
    rewriteCurrentGameState(JSON.parse(code))
    enqueueSnackbar('State saved', {
      preventDuplicate: true,
      variant: 'success',
    })
  }

  const toolbar = (
    <>
      <button className="small">History</button>
      <button className="small" onClick={onClear}>
        Clear
      </button>
    </>
  )

  return (
    <Window toolbar={toolbar}>
      <Editor
        theme="sds-dark"
        height={height}
        defaultLanguage="json"
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={onChange}
        beforeMount={handleEditorWillMount}
      />
    </Window>
  )
}

export default StateManager
