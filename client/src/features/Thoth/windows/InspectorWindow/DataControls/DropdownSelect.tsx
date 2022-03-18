import Select from '../../../../common/Select/Select'

const DropdownSelect = ({ control, updateData, initialValue }) => {
  const { dataKey, data } = control

  const {values, defaultValue} = data

  const options = values.map((value, index) => ({
      value: value,
      label: value,
    }))

  const value = initialValue?.length > 0 ? initialValue : defaultValue

  const defaultVal = {value, label: value}

  const onChange = async ({ value }) => {
    update(value)
  }

  const update = update => {
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
