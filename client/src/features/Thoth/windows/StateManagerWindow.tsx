// @ts-nocheck
import Editor from '@monaco-editor/react'
import jsonFormat from 'json-format'
import { useSnackbar } from 'notistack'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import {
  selectSpellById,
  useSaveSpellMutation,
} from '../../../state/api/spells'
import {
  selectGameStateBySpellId,
  // updateGameState,
} from '../../../state/gameState'
import Window from '../../common/Window/Window'

import '../thoth.module.css'
import { RootState } from '../../../state/store'
import WindowMessage from '../components/WindowMessage'

const StateManager = ({ tab, ...props }) => {
  // const dispatch = useDispatch()
  const [saveSpell] = useSaveSpellMutation()
  const gameState = useSelector((state: RootState) => {
    return selectGameStateBySpellId(state.gameState, tab.spell)
  })
  const spell = useSelector(state => selectSpellById(state, tab.spell))

  const { enqueueSnackbar } = useSnackbar()
  const [typing, setTyping] = useState<boolean>(false)
  const [code, setCode] = useState('{}')
  const [height, setHeight] = useState<number>()

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
      setHeight((props.node.rect.height - bottomHeight) as number)

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

  // update code when game state changes
  useEffect(() => {
    if (!gameState) return
    setCode(jsonFormat(gameState.state))
  }, [gameState])

  const onClear = () => {
    const reset = `{}`
    setCode(reset)
  }

  const onChange = code => {
    setCode(code)
    setTyping(true)
  }

  const onSave = () => {
    if (!gameState) return
    const parsedState = JSON.parse(code)
    const spellUpdate = {
      ...spell,
      gameState: parsedState,
    }
    saveSpell(spellUpdate)
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

  if (tab.type === 'module')
    return <WindowMessage content="Modules do not support game state" />

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
