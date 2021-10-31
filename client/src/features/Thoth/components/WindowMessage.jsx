import css from '../windows/InspectorWindow/DataControls/datacontrols.module.css'

const WindowMessage = ({ content = 'No component selected' }) => {
  return <p className={css['message']}>{content}</p>
}

export default WindowMessage
