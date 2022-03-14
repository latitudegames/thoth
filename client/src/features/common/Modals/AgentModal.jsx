import { SettingsRemoteSharp } from '@material-ui/icons'
import { useState } from 'react'
import Modal from '../Modal/Modal'

const AgentModal = ({ content, onClose, options: _options }) => {
  const [message, setMessage] = useState('')
  const [versionName, setVersionName] = useState('')
  const options = [
    {
      label: 'Create Agent',
      className: 'primary',
      onClick: () => {
        onClose({ message, versionName })
      },
    },
  ]
  const updateNotes = e => {
    setMessage(e.target.value)
  }

  const updateVersionName = e => {
    setVersionName(e.target.value)
  }

  return (
    <Modal title="Create Agent" options={options} icon="add">
      <br />
      <h4>CHANGE NOTES</h4>
      <input type="text" style={{ width: '100%' }} onChange={updateNotes} onChange={updateVersionName} />
    </Modal>
  )
}

export default AgentModal
