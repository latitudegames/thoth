//@ts-nocheck
import { useEffect, useState } from 'react'
import { useModal } from '@/contexts/ModalProvider';
import { VscWand, VscTrash, VscSave } from 'react-icons/vsc'
import axios from 'axios'
import { useModal } from '@/contexts/ModalProvider';

const ContentObject = ({ content, getContentObjects }) => {
  const [contentObj, setContentObj] = useState({
    objId: content.id,
    keywords: content.keywords,
    description: content.description,
    is_included: content.is_included,
    documentId: content.document_id
  })
  const { openModal } = useModal()

  const updateObj = async () => {
    const body = { ...contentObj }
    await axios.put(`${process.env.REACT_APP_SEARCH_SERVER_URL}/content-object`, body)
    await getContentObjects()
  }
  const deleteObj = () => {
    openModal({
      modal: 'documentDeleteModal',
      isContentObj: true,
      objId: content.id,
      getContentObjects
    })
  }

  return (
    <div className="search-corpus-document">
      <div className="d-flex align-items-center justify-content-between">
        <div className="form-item">
          <input 
            type="checkbox" 
            name="include" 
            className="custom-checkbox" 
            checked={contentObj.is_included}
            onChange={() => setContentObj({
              ...contentObj,
              is_included: !contentObj.is_included
            })} 
          />
          <span className="form-item-label" style={{ marginBottom: 'unset' }}>Include</span>
        </div>
        <div className="form-item">
          <VscSave size={20} color='#A0A0A0' onClick={updateObj} style={{ margin: '0 0.5rem'}}/>
          <VscTrash size={20} color='#A0A0A0' onClick={deleteObj}/>
        </div>
      </div>
      <div className="form-item">
        <span className="form-item-label">Keywords</span>
        <div className='d-flex justify-content-between align-items-center'>
          <input
            type="text"
            className="form-text-area"
            value={contentObj.keywords}
            onChange={e => setContentObj({
              ...contentObj,
              keywords: e.target.value
            })}
          ></input>
        </div>
      </div>
      <div className="form-item">
        <span className="form-item-label">Description</span>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-text-area"
            value={contentObj.description}
            onChange={e => setContentObj({
              ...contentObj,
              description: e.target.value
            })}
          ></input>
        </div>
      </div>
      <div className="form-item search-corpus">
        <span className="form-item-label">Type</span>
        <select
          name="documents"
          id="documents"
        >
          <option value="document">Document</option>
        </select>
      </div>
    </div>
  );
}

export default ContentObject;