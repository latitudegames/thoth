import { useState, useEffect, useCallback, useRef } from 'react'
import { Scrollbars } from 'react-custom-scrollbars-2'
import { useHotkeys } from 'react-hotkeys-hook'

import { usePubSub } from '../../../contexts/PubSubProvider'
import Window from '../../common/Window/Window'
import css from '../thoth.module.css'
import singleton from '../../../speechUtils'

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

  useEffect(() => {
    window.onbeforeunload = () => {
      if (
        props &&
        props.recording &&
        !singleton.getInstance().streamStreaming
      ) {
        singleton.getInstance().socket?.emit('endGoogleCloudStream', '')
      }
    }
  }, [])

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
      <button
        className="small"
        onClick={props.recording ? props.stopRecord : props.record}
      >
        {props.recording ? 'Stop Recording' : 'Record'}
      </button>
    </div>
  )
}

const Playtest = ({ tab }) => {
  const recordingRef = useRef(false)
  const [update, setUpdate] = useState(false)

  const startRecording = updateState => {
    if (recordingRef.current === true) return
    recordingRef.current = true
    singleton.getInstance().initRecording(text => {
      send(text)
    })
    if (updateState) {
      setUpdate(!update)
    }
  }
  const stopRecording = updateState => {
    if (recordingRef.current === false) return
    singleton.getInstance().stopRecording()
    recordingRef.current = false
    if (updateState) {
      setUpdate(!update)
    }
  }

  useHotkeys(
    'shift+r',
    () => {
      startRecording(false)
    },
    { enableOnTags: 'INPUT' },
    [recordingRef]
  )

  document.addEventListener(
    'keyup',
    function (event) {
      document.addEventListener('keyup', handleEventListener(event))

      return () =>
        document.removeEventListener('keyup', handleEventListener(event))
    },
    []
  )

  function handleEventListener(event) {
    if (
      (event.key.toLowerCase() === 'r' ||
        event.key.toLowerCase() === 'shift') &&
      recordingRef.current === true
    ) {
      stopRecording(false)
    }
  }

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

  useEffect(() => {
    const unsubscribe = subscribe($PLAYTEST_PRINT(tab.id), printToConsole)

    // return a clean up function
    return unsubscribe
  }, [subscribe, printToConsole, $PLAYTEST_PRINT])

  const printItem = (text, key) => (
    <li key={key}>{typeof text === 'string' ? text : JSON.stringify(text)}</li>
  )

  const onSend = () => {
    const newHistory = [...history, `You: ${value}`]
    setHistory(newHistory)
    publish($PLAYTEST_INPUT(tab.id), value || ' ')
    setValue('')
  }
  const send = text => {
    console.log('send:', text)
    const newHistory = [...history, `You: ${text}`]
    setHistory(newHistory)
    publish($PLAYTEST_INPUT(tab.id), text)
  }

  const onChange = e => {
    setValue(e.target.value)
  }

  const onClear = () => {
    setHistory([])
  }

  const toolbar = (
    <>
      <button className="small" onClick={onClear}>
        Clear
      </button>
    </>
  )

  return (
    <Window toolbar={toolbar}>
      <div style={{ display: 'flex', height: '100%', flexDirection: 'column' }}>
        <div className={css['playtest-output']}>
          <Scrollbars>
            <ul>{history.map(printItem)}</ul>
          </Scrollbars>
        </div>
        <Input
          onChange={onChange}
          value={value}
          onSend={onSend}
          recording={recordingRef.current}
          record={() => startRecording(true)}
          stopRecord={() => stopRecording(true)}
        />
      </div>
    </Window>
  )
}

export default Playtest
