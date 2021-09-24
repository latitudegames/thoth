const Input = ({ value, onChange, style = {} }) => {
  return <input style={style} value={value} type="text" onChange={onChange} />
}

export default Input
