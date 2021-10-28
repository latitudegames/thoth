import Icon from '../../common/Icon/Icon'
import css from '../homeScreen.module.css'

const ProjectRow = ({ label, selectedSpell, onClick, icon, style }) => {
  return (
    <div
      role="button"
      className={`${css['project-row']} ${
        css[selectedSpell?.name === label ? 'selected' : '']
      }`}
      onClick={onClick}
      style={style}
    >
      {icon && (
        <Icon name={icon} style={{ marginRight: 'var(--extraSmall)' }} />
      )}
      {label}
    </div>
  )
}

export default ProjectRow
