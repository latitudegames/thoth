import Panel from '../../common/Panel/Panel'
import css from '../startScreen.module.css'

const TemplatePanel = ({
  label,
  bg,
  setSelectedTemplate,
  selectedTemplate,
}) => {
  return (
    <div
      className={`${css['template-container']} ${
        css[selectedTemplate === label && 'selected']
      }`}
      onClick={() => {
        setSelectedTemplate(label)
      }}
    >
      <Panel
        shadow
        style={{
          width: 'var(--c20)',
          height: 'var(--c12)',
          backgroundColor: 'var(--dark-3)',
          backgroundImage: `url(${bg})`,
        }}
        className={css['template-panel']}
      ></Panel>
      <p>{label}</p>
    </div>
  )
}

export default TemplatePanel
