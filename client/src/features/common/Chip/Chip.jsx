import Icon from '../Icon/Icon'
import css from './chip.module.css'

const Chip = ({ label, onClick, noEvents }) => {
  return (
    <div
      className={`${css['chip']} ${css[noEvents && 'no-events']}`}
      onClick={onClick}
    >
      {label}
      {!noEvents && <Icon name="close" />}
    </div>
  )
}

export default Chip
