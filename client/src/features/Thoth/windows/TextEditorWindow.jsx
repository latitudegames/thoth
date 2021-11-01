import Editor from '@monaco-editor/react'
import { useSnackbar } from 'notistack'
import { useState, useEffect } from 'react'

import { useLayout } from '@thoth/contexts/LayoutProvider'
import Window from '@common/Window/Window.tsx'
import WindowMessage from '@thoth/components/WindowMessage'

import '../thoth.module.css'

const TextEditor = props => {
  const [code, setCode] = useState('')
  const [data, setData] = useState('')
  const [height, setHeight] = useState()
  const [editorOptions, setEditorOptions] = useState()
  const [typing, setTyping] = useState(null)
  const [language, setLanguage] = useState(null)
  const { textEditorData, saveTextEditor } = useLayout()
  const { enqueueSnackbar } = useSnackbar()

  const bottomHeight = 50
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
    const options = {
      lineNumbers: language === 'javascript',
      minimap: {
        enabled: false,
      },
      suggest: {
        preview: language === 'javascript',
      },
      wordWrap: 'bounded',
      fontSize: 14,
      fontFamily: '"IBM Plex Mono", sans-serif !important',
    }

    setEditorOptions(options)
  }, [language])

  useEffect(() => {
    if (!textEditorData) return
    setData(textEditorData)
    setCode(textEditorData.data)
    setTyping(false)

    if (textEditorData?.options?.language) {
      setLanguage(textEditorData.options.language)
    }
  }, [textEditorData])

  useEffect(() => {
    if (props?.node?.rect?.height)
      setHeight(props.node.rect.height - bottomHeight)

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener('resize', data => {
      setTimeout(() => setHeight(data.rect.height - bottomHeight), 0)
    })
  }, [props.node])

  // debounce for delayed save
  useEffect(() => {
    if (!typing) return

    const delayDebounceFn = setTimeout(() => {
      save(code)
      setTyping(false)
    }, 2000)

    return () => clearTimeout(delayDebounceFn)
  }, [code])

  const save = code => {
    const update = {
      ...data,
      data: code,
    }
    setData(update)
    saveTextEditor(update)
    enqueueSnackbar('Editor saved', {
      preventDuplicate: true,
      variant: 'success',
    })
  }

  const onSave = () => {
    save(code)
  }

  const updateCode = code => {
    setCode(code)
    const update = {
      ...data,
      data: code,
    }
    setData(update)
    setTyping(true)
  }

  const toolbar = (
    <>
      <div style={{ flex: 1, marginTop: 'var(--c1)' }}>
        {textEditorData?.name && textEditorData?.name + ' - ' + language}
      </div>
      <button onClick={onSave}>SAVE</button>
    </>
  )

  if (!textEditorData.control)
    return <WindowMessage content="Component has no editable text" />

  return (
    <Window toolbar={toolbar}>
      <Editor
        theme="sds-dark"
        height={height}
        language={language}
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={updateCode}
        beforeMount={handleEditorWillMount}
      />
    </Window>
  )
}

export default TextEditor
