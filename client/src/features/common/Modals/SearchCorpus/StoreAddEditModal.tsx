//@ts-nocheck
import { useState } from 'react'
import Modal from '../../Modal/Modal'
import css from '../modalForms.module.css'
import axios from 'axios'

const StoreAddEditModal = ({ closeModal, store, getDocumentsStores, opType }) => { 
  const [name, setName] = useState(store ? store.name : '')
  const performOperation = async () => {
    switch(opType) {
      case 'add': {
        let body = { name }
        await axios.post(
          `${process.env.REACT_APP_SEARCH_SERVER_URL}/document-store`,
          body
        )
        break
      }
      case 'edit': {
        let body = {
          id: store.id,
          name
        }
        await axios.put(
          `${process.env.REACT_APP_SEARCH_SERVER_URL}/document-store`,
          body
        )
        break
      }
      default: break
    }
    await getDocumentsStores()
    closeModal()
    
  }
  const operation = opType === 'add' ? 'Add' : 'Update'
  const title = `${operation} Store`
  const options = [
    {
      className: `${css['loginButton']} secondary`,
      label: operation,
      onClick: performOperation,
    },
  ]

  return (
    <Modal title={title} icon='add' options={options}>
      <form>
        <div className="form-item">
          <span className="form-item-label">Store Name:</span>
          <input
            type="text"
            className="form-text-area"
            onChange={e => setName(e.target.value)}
            defaultValue={name}
          ></input>
        </div>
      </form>
    </Modal>
  );
}

export default StoreAddEditModal;