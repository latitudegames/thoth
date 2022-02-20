import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

const SwitchComponent = ({ label: _label, checked, onChange }) => {
  const label = { inputProps: { 'aria-label': _label } }

  return (
    <FormControlLabel
      label={_label}
      control={<Switch {...label} checked={checked} onChange={onChange} />}
    />
  )
}

export default SwitchComponent
