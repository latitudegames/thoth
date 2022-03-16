import Icon from '../../common/Icon/Icon'
import css from '../homeScreen.module.css'

const ProjectRow = ({
  label,
  selectedSpell,
  onClick,
  icon,
  spell,
  style,
  onDelete = false,
}) => {
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
      {onDelete && (
        <Icon
          name="trash"
          onClick={() => {
            onDelete(spell.name)
          }}
          style={{
            marginRight: 'var(--extraSmall)',
            position: 'absolute',
            right: 'var(--extraSmall)',
            zIndex: 10,
          }}
        />
      )}
    </div>
  )
}

export default ProjectRow
