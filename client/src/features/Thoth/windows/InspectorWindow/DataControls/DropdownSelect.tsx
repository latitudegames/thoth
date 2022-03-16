import Select from '../../../../common/Select/Select'

const DropdownSelect = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control

  const {values, defaultValue} = data

  console.log({values, initialValue, defaultValue})
  const shownValue = defaultValue ?? initialValue

  const options = values.map((value, index) => ({
      value: value,
      label: value,
    }))

  const onChange = async ({ value }) => {
    update(value)
  }

  const update = update => {
    updateData({ [dataKey]: update })
  }



  return (
    <div style={{ flex: 1 }}>
      <Select
        createOptionPosition="top"
        options={options}
        onChange={onChange}
        defaultInputValue={shownValue}
        placeholder="select value"
      />
    </div>
  )
}

export default DropdownSelect
