import Select from '../../../../common/Select/Select'

const DropdownSelect = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control
  console.log({data})

  const {values, defaultValue} = data

  const options = values.map((value, index) => ({
      value: value,
      label: value,
    }))

  const value = initialValue?.length > 0 ? initialValue : defaultValue

  const defaultVal = {value, label: value}

  console.log({value, initialValue, defaultValue})

  const onChange = async ({ value }) => {
    update(value)
  }

  const update = update => {
    console.log({update, dataKey})
    updateData({ [dataKey]: update })
  }

  return (
    <div style={{ flex: 1 }}>
      <Select
        options={options}
        onChange={onChange}
        defaultValue={defaultVal}
        placeholder="select value"
        creatable={false}
      />
    </div>
  )
}

export default DropdownSelect
