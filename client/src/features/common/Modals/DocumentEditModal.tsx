import { useState } from 'react'
import Modal from '../Modal/Modal'

const capitalizeFirstLetter = (word: string) => {
  if(!word) return ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const DocumentEditModal = ({ field, value }) => {
  const [val, setValue] = useState(value)

  const update = () => {
    console.log('value ::: ', value);
  }
  
  return (
    <Modal title='Edit Document' icon='add'>
      <form>
        <div className="form-item">
          <span className="form-item-label">{capitalizeFirstLetter(field)}</span>
          <input
            type="text"
            className="form-text-area"
            defaultValue={val}
            onChange={e => setValue(e.target.value)}
          ></input>
        </div>
        <br />
        <button type="button" onClick={update}>
          Updated
        </button>
        <br />
      </form>
    </Modal>
  );
}

export default DocumentEditModal;