import { useModal } from '@/contexts/ModalProvider';
import { VscWand } from 'react-icons/vsc'

const SearchCorpusDocument = ({ document }) => {
  const { openModal } = useModal()

  const openAddModal = () => {
    openModal({
      modal: 'documentAddModal'
    })
  }

  const openEditModal = (field: string, value: string) => {
    openModal({
      modal: 'documentEditModal',
      field,
      value
    })
  }

  return (
    <div className="search-corpus-document">
      <div className="form-item d-flex align-items-center">
        <input type="checkbox" name="include" id="include" className="custom-checkbox"/>
        <span className="form-item-label" style={{ marginBottom: 'unset' }}>Include</span>
      </div>
      <div className="form-item">
        <span className="form-item-label">Keywords</span>
        <div className='d-flex justify-content-between align-items-center'>
          <input
            type="text"
            className="form-text-area"
            style={{ width: '96%' }}
            defaultValue={document.keywords}
            readOnly
          ></input>
          <VscWand size={20} color='#A0A0A0' onClick={() => openEditModal('keywords', document.keywords)}/>
        </div>
      </div>
      <div className="form-item">
        <span className="form-item-label">Description</span>
        <div className="d-flex justify-content-between align-items-center">
          <input
            type="text"
            className="form-text-area"
            style={{ width: '96%' }}
            readOnly
          ></input>
          <VscWand size={20} color='#A0A0A0' onClick={() => openEditModal('description', 'desc')}/>  
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

      <div className="form-item">
        <span className="form-item-label">Content</span>
        <div className="d-flex ">
          <button
            className="button search-corpus-btn"
            type="button"
            onClick={async e => {
              e.preventDefault()
            }}
          >
            Click to edit
          </button>
          <button
            className="button search-corpus-btn"
            type="button"
            onClick={async e => {
              e.preventDefault()
              openAddModal()
            }}
          >
            Click to add
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchCorpusDocument;