import Editor from '@monaco-editor/react'
import jsonFormat from 'json-format'
// import debounce from 'lodash.debounce'
import { useSnackbar } from 'notistack'
import { useState, useEffect } from 'react'
import {
  useGetSpellQuery,
  useSaveSpellMutation,
} from '../../../state/api/spells'
import Window from '../../../components/Window/Window'

import '../../../screens/Thoth/thoth.module.css'
import WindowMessage from '../components/WindowMessage'

const StateManager = ({ tab, ...props }) => {
  // const dispatch = useDispatch()
  const [saveSpell] = useSaveSpellMutation()
  const { data: spell } = useGetSpellQuery(tab.spellId, {
    skip: !tab.spellId,
  })

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
    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [code])

  // update code when game state changes
  useEffect(() => {
    if (!spell?.gameState) return
    setCode(jsonFormat(spell.gameState))
  }, [spell])

  const onClear = () => {
    const reset = `{}`
    setCode(reset)
  }

  const onChange = code => {
    setCode(code)
    setTyping(true)
  }

  const onSave = async () => {
    try {
      const parsedState = JSON.parse(code)
      const spellUpdate = {
        ...spell,
        gameState: parsedState,
      }
      const res = await saveSpell(spellUpdate)
      if ('error' in res) {
        enqueueSnackbar('Error saving state', {
          preventDuplicate: true,
          variant: 'error',
        })
        throw new Error('Error saving spell')
      }
      res.data.gameState && setCode(JSON.stringify(res.data.gameState?.state))

      enqueueSnackbar('State saved', {
        preventDuplicate: true,
        variant: 'success',
      })
    } catch (err) {
      console.log(err)
    }
  }

  const toolbar = (
    <>
      <button className="small" onClick={onSave}>
        Save
      </button>
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