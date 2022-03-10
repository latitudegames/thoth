import { useState } from 'react'
import Modal from '../Modal/Modal'
import css from './modalForms.module.css'
import axios from 'axios'

const DocumentAddModal = ({ closeModal, storeId, documentId, isContentObject, getDocuments, getContentObjects }) => {
  let parentId = isContentObject ? 'documentId' : 'storeId'
  let doc = {
    description: '',
    keywords: '',
    is_included: true,
    [parentId]: isContentObject ? parseInt(documentId) : parseInt(storeId)
  }
  const title = isContentObject ? 'Add Content Object' : 'Add Document'
  const [newDocument, setNewDocument] = useState(doc)

  const add = async () => {
    const body = { ...newDocument }
    let url = 
      isContentObject ? 
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/content-object` :
      `${process.env.REACT_APP_SEARCH_SERVER_URL}/document`
    
    await axios.post(url, body)
    await getDocuments()
    if(isContentObject) await getContentObjects()
    closeModal()
  }
  const options = [
    {
      className: `${css['loginButton']} secondary`,
      label: 'Add',
      onClick: add,
    },
  ]
  return (
    <Modal title={title} icon='add' options={options}>
      <form>
        <div className="form-item d-flex align-items-center">
          <input 
            type="checkbox" 
            name="include" 
            className="custom-checkbox"
            onChange={e => setNewDocument({
              ...newDocument,
              is_included: !newDocument.is_included
            })}
            checked={newDocument.is_included}
          />
          <span className="form-item-label" style={{ marginBottom: 'unset' }}>Include</span>
        </div>
        <div className="form-item">
          <span className="form-item-label">Keywords</span>
          <input
            type='text'
            className="form-text-area"
            onChange={e => setNewDocument({
              ...newDocument,
              keywords: e.target.value
            })}
            defaultValue={newDocument.keywords}
          ></input>
        </div>
        <div className="form-item">
          <span className="form-item-label">Description</span>
          <input
            type='text'
            className="form-text-area"
            onChange={e => setNewDocument({
              ...newDocument,
              description: e.target.value
            })}
            defaultValue={newDocument.description}
          ></input>
        </div>
      </form>
    </Modal>
  );
}

export default DocumentAddModal;