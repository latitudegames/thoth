import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useHotkeys } from 'react-hotkeys-hook'

import { usePubSub } from '../../../contexts/PubSubProvider'
import Window from '../../../components/Window/Window'
import css from '../../../screens/Thoth/thoth.module.css'

const Input = props => {
  const ref = useRef()
  useHotkeys(
    'return',
    () => {
      if (ref.current !== document.activeElement) return
      props.onSend()
    },
    { enableOnTags: 'INPUT' },
    [props, ref]
  )

  return (
    <div className={css['playtest-input']}>
      <input
        ref={ref}
        type="text"
        value={props.value}
        onChange={props.onChange}
      ></input>
      <button className="small" onClick={props.onSend}>
        Send
      </button>
    </div>
  )
}

const Playtest = ({ tab }) => {
  const scrollbars = useRef()
  const [history, setHistory] = useState([])
  const [value, setValue] = useState('')

  const { publish, subscribe, events } = usePubSub()

  const { $PLAYTEST_INPUT, $PLAYTEST_PRINT } = events

  const printToConsole = useCallback(
    (_, _text) => {
      let text = typeof _text === 'object' ? JSON.stringify(_text) : _text
      const newHistory = [...history, text]
      setHistory(newHistory)
    },
    [history]
  )
  useEffect(()=>{
    scrollbars.current.scrollToBottom();
  }, [history])
  useEffect(() => {
    const unsubscribe = subscribe($PLAYTEST_PRINT(tab.id), printToConsole)

    // return a clean up function
    return unsubscribe
  }, [subscribe, printToConsole, $PLAYTEST_PRINT])

  const printItem = (text, key) => <li key={key}>{text}</li>

  const onSend = () => {
    const newHistory = [...history, `You: ${value}`]
    setHistory(newHistory)
    publish($PLAYTEST_INPUT(tab.id), value)
    setValue('')
  }

  const onChange = e => {
    setValue(e.target.value)
  }

  const onClear = () => {
    setHistory([])
  }

  const toolbar = (
    <React.Fragment>
      <button className="small" onClick={onClear}>
        Clear
      </button>
    </React.Fragment>
  )

  return (
    <Window toolbar={toolbar}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className={css['playtest-output']}>
          <Scrollbars ref={ref => (scrollbars.current = ref)} >
            <ul>{history.map(printItem)}</ul>
          </Scrollbars>
        </div>
        <Input onChange={onChange} value={value} onSend={onSend} />
      </div>
    </Window>
  )
}

export default Playtest
