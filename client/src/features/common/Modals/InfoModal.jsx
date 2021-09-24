import Modal from '../Modal/Modal'

const InfoModal = ({ title, content }) => {
  return (
    <Modal title={title} icon="info">
      <p style={{ whiteSpace: 'pre-line' }}> {content} </p>
    </Modal>
  )
}

export default InfoModal
