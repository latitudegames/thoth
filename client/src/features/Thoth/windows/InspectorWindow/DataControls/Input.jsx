import { useState } from 'react'

import InputComponent from '../../../../common/Input/Input'

const Input = ({ control, updateData, initialValue }) => {
  const [value, setValue] = useState(initialValue)
  const { dataKey, type } = control

  const onChange = e => {
    if (type === 'number') {
      try {
        const number =
          e.target.value.includes('.') || e.target.value.includes(',')
            ? parseFloat(e.target.value)
            : parseInt(e.target.value)
        setValue(number || 0)
        updateData({ [dataKey]: number || 0 })
      } catch (e) {
        setValue(0)
        updateData({ [dataKey]: 0 })
      }
    } else if (type === 'boolean') {
      const boolean = e.target.value == '1'
      setValue(boolean)
      updateData({ [dataKey]: boolean })
    } else if (type === 'array') {
      const data = e.target.value.split(',')
      if (data.length > 0) {
        setValue(data)
        updateData({ [dataKey]: data })
      } else {
        setValue(e.target.value)
        const value = e.target.value === '\\n' ? '\n' : e.target.value
        updateData({
          [dataKey]: value,
        })
      }
    } else {
      setValue(e.target.value)
      const value = e.target.value === '\\n' ? '\n' : e.target.value
      updateData({
        [dataKey]: value,
      })
    }
  }

  return (
    <div style={{ flex: 1, display: 'flex' }}>
      <InputComponent
        style={{ flex: 6 }}
        value={value}
        type="text"
        onChange={onChange}
      />
    </div>
  )
}

export default Input
