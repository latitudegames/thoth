import { useState } from 'react'
import Modal from '../Modal/Modal'

const DocumentAddModal = () => {
  const [newDocument, setNewDocument] = useState({
    agent: '',
    document: '',
    metadata: ''
  })

  const add = async () => {
    const body = {
      agent: newDocument.agent,
      document: newDocument.document,
      metadata: newDocument.metadata,
    }
    console.log('req Body ::: ', body);
    
  }
  
  return (
    <Modal title='Add Document' icon='add'>
      <form>
        <div className="form-item">
          <span className="form-item-label">Agent:</span>
          <textarea
            className="form-text-area"
            onChange={e => setNewDocument({
              ...newDocument,
              agent: e.target.value
            })}
            defaultValue={newDocument.agent}
          ></textarea>
        </div>
        <div className="form-item">
          <span className="form-item-label">Document:</span>
          <textarea
            className="form-text-area"
            onChange={e => setNewDocument({
              ...newDocument,
              document: e.target.value
            })}
            defaultValue={newDocument.document}
          ></textarea>
        </div>
        <div className="form-item">
          <span className="form-item-label">Metadata:</span>
          <textarea
            className="form-text-area"
            onChange={e => setNewDocument({
              ...newDocument,
              metadata: e.target.value
            })}
            defaultValue={newDocument.metadata}
          ></textarea>
        </div>
      </form>
      <br />
      <button
        className="button"
        type="button"
        onClick={async e => {
          e.preventDefault()
          await add()
        }}
      >
        Create New
      </button>
    </Modal>
  );
}

export default DocumentAddModal;