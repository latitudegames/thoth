// @ts-nocheck
import jsonFormat from 'json-format'
import { useSnackbar } from 'notistack'
import { default as React, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  selectSpellById,
  useSaveSpellMutation
} from '../../../../state/api/spells'
import {
  selectGameStateBySpellId
} from '../../../../state/gameState'
import { RootState } from '../../../../state/store'
import Window from '../../../common/Window/Window'
import WindowMessage from '../../components/WindowMessage'
import '../../thoth.module.css'
import AgentInstances from "./AgentInstances"
import Agents from './Agents'
import Config from './Config'
import Prompts from './Prompts'
import { views } from './views'
import '../../thoth.module.css'


const AgentManager = ({ tab, ...props }) => {

  const [currentView, setCurrentView] = useState(views.Agents);

  const changeView = (view) => {
    setCurrentView(view);
  }

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
      <span onClick={() => changeView(views.Agents)} className={currentView === views.Agents ? "nav-item-active" : "nav-item"} >
        Agents
      </span>

      <span onClick={() => changeView(views.AgentInstances)} className={currentView === views.AgentInstances ? "nav-item-active" : "nav-item"} >
        Instances
      </span>

      <span onClick={() => changeView(views.Config)} className={currentView === views.Config ? "nav-item-active" : "nav-item"} >
        Config
      </span>

      <span onClick={() => changeView(views.Prompts)} className={currentView === views.Prompts ? "nav-item-active" : "nav-item"} >
        Prompts
      </span>
    </>
  )

  if (tab.type === 'module')
    return <WindowMessage content="Modules do not support game state" />

  return (
    <Window toolbar={toolbar}>
      <div className="agents-container">
        {currentView === views.Agents && <Agents />}
        {currentView === views.Config && <Config />}
        {currentView === views.AgentInstances && <AgentInstances />}
        {currentView === views.Prompts && <Prompts />}
      </div>

    </Window>
  )
}

export default AgentManager
