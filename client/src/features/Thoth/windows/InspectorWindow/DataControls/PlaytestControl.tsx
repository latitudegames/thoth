import { useState } from 'react'

import Switch from '../../../../common/Switch/Switch'

type SocketType = {
  name: string
  socketKey: string
  socketType: string
  taskType: string
}

const SwitchControl = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control
  const { receivePlaytest } = initialValue
  const initial =
    typeof receivePlaytest === 'boolean'
      ? receivePlaytest
      : receivePlaytest === 'true'
  const [checked, setChecked] = useState(initial)

  const onChange = e => {
    const playtest = e.target.checked
    setChecked(playtest)

    const outputs = [] as SocketType[]

    if (playtest) {
      outputs.push({
        name: 'Playtest trigger',
        socketKey: 'trigger',
        socketType: 'triggerSocket',
        taskType: 'option',
      })
    }

    updateData({
      [dataKey]: {
        receivePlaytest: playtest,
        outputs,
      },
    })
  }

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <Switch checked={checked} onChange={onChange} label={data.label} />
    </div>
  )
}

export default SwitchControl
