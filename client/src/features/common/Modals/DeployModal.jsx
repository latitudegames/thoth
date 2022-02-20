import { useState } from 'react'

import Modal from '../Modal/Modal'

const DeployModal = ({ onClose, options: _options }) => {
  const [message, setMessage] = useState('')
  const [versionName, setVersionName] = useState('')
  const options = [
    {
      label: 'Deploy',
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
    <Modal title="New Deployment" options={options} icon="add">
      <br />
      <h4>NEXT VERSION</h4>
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
      <h4>VERSION NAME</h4>
      <input
        type="text"
        style={{ width: '100%' }}
        onChange={updateVersionName}
      />
      <h4>CHANGE NOTES</h4>
      <input type="text" style={{ width: '100%' }} onChange={updateNotes} />
    </Modal>
  )
}

export default DeployModal
