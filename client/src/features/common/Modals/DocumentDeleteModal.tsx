//@ts-nocheck
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import axios from 'axios'

const DocumentDeleteModal = ({ closeModal, documentId, getDocuments }) => {
  const deleteDocument = async () => {
    await axios.delete(
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/document`,
      {
        params: {
          documentId,
        },
      }
    )
    await getDocuments()
    closeModal()
  }
  
  const options = [
    {
      className: `${css['loginButton']} secondary`,
      label: 'Delete',
      onClick: deleteDocument,
    },
  ]

  return (
    <Modal title='Warning' icon='warn' options={options}>
      <p style={{ whiteSpace: 'pre-line' }}>Are you sure to delete the document?</p>
    </Modal>
  );
}

export default DocumentDeleteModal;