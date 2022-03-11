import { useState } from 'react'

import InputComponent from '../../../../common/Input/Input'

const Input = ({ control, updateData, initialValue }) => {
  const [value, setValue] = useState(initialValue)
  const { dataKey, type } = control

  const onChange = e => {
    if (type === 'number') {
      try {
        const number = parseFloat(e.target.value.replace(/[^\d.-]/g, ''))
        setValue(number || 0)
        updateData({ [dataKey]: number || 0 })
      } catch (e) {
        setValue(0)
        updateData({ [dataKey]: 0 })
      }
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
      {type !== 'boolean' ? (
        <InputComponent
          style={{ flex: 6 }}
          value={value}
          type="text"
          onChange={onChange}
        />
      ) : (
        <div>
          <input
            type="checkbox"
            defaultChecked={false}
            onChange={e => {
              const boolean = e.target.checked
              setValue(boolean)
              updateData({ [dataKey]: boolean })
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Input
