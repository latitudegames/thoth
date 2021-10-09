const Input = ({ value, onChange = () => {}, style = {}, ...props }) => {
  return (
    <input
      style={style}
      value={value}
      type="text"
      onChange={onChange}
      {...props}
    />
  )
}

export default Input
