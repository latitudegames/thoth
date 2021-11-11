import { useState } from 'react'

import Switch from '../../../../common/Switch/Switch'

const SwitchControl = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control
  const [checked, setChecked] = useState(initialValue)

  const onChange = e => {
    setChecked(e.target.checked)
    updateData({
      [dataKey]: e.target.checked,
    })
  }

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <Switch checked={checked} onChange={onChange} label={data.label} />
    </div>
  )
}

export default SwitchControl
