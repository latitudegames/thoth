//@ts-nocheck
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import axios from 'axios'

const DocumentDeleteModal = ({ closeModal, documentId, objId, isContentObj, getDocuments, getContentObjects }) => {
  let url = isContentObj ? 
    `${process.env.REACT_APP_SEARCH_SERVER_URL}/content-object` : 
    `${process.env.REACT_APP_SEARCH_SERVER_URL}/document`
  let params = isContentObj ? {
    objId
  } : {
    documentId
  }
  let entityToDelete = isContentObj ? 'content' : 'document'
  
  const deleteEntity = async () => {
    await axios.delete(url, { params: params })
    if(isContentObj) await getContentObjects()
    else await getDocuments()
    closeModal()
  }
  
  const options = [
    {
      className: `${css['loginButton']} secondary`,
      label: 'Delete',
      onClick: deleteEntity,
    },
  ]

  return (
    <Modal title='Warning' icon='warn' options={options}>
      <p style={{ whiteSpace: 'pre-line' }}>Are you sure to delete the {entityToDelete}?</p>
    </Modal>
  );
}

export default DocumentDeleteModal;