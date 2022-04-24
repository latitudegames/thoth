import Modal from '@/components/Modal/Modal'
import { useModal } from '../../contexts/ModalProvider'

const SettingsModal = () => {
  const { closeModal } = useModal()
  const options = [
    { label: 'Oki doki', className: 'primary', onClick: closeModal },
  ]
  return (
    <Modal title="Settings" options={options} icon="ankh">
      <p>Settings!</p>
    </Modal>
  )
}

export default SettingsModal
