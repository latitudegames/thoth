import { SettingsRemoteSharp } from '@material-ui/icons'
import { useState } from 'react'
import { useModal } from '../../../contexts/ModalProvider'
import Input from '../Input/Input'
import Modal from '../Modal/Modal'

const DeployModal = ({ content, onClose, options: _options }) => {
  const { closeModal } = useModal()
  const [notes, setNotes] = useState('')
  const options = [
    {
      label: 'Deploy',
      className: 'primary',
      onClick: () => {
        onClose(notes)
      },
    },
  ]
  const updateNotes = e => {
    setNotes(e.target.value)
  }
  return (
    <Modal title="New Deployment" options={options} icon="add">
      <br />
      <h4>VERSION</h4>
      <p
        style={{
          backgroundColor: 'var(--dark-1)',
          padding: 'var(--c1)',
          borderRadius: 'var(--c1)',
          display: 'inline-block',
          fontFamily: 'IBM Plex Mono',
          margin: 0,
        }}
      >
        {_options.version}
      </p>
      <h4>CHANGE NOTES</h4>
      <input type="text" style={{ width: '100%' }} onChange={updateNotes} />
    </Modal>
  )
}

export default DeployModal
