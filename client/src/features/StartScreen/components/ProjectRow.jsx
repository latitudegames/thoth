import Icon from '../../common/Icon/Icon'
import css from '../startScreen.module.css'

const ProjectRow = ({ label, selectedProject, onClick, icon, style }) => {
  return (
    <div
      role="button"
      className={`${css['project-row']} ${
        css[selectedProject === label ? 'selected' : '']
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
