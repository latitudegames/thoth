import ExampleModal from './ExampleModal'
import InfoModal from './InfoModal'
import LoginModal from './LoginModal'
import DeployModal from './DeployModal'
import EditSpellModal from './EditSpellModal'
import SaveAsModal from './SaveAsModal'
import DocumentAddModal from './DocumentAddModal'
import DocumentEditModal from './DocumentEditModal'
import StoreAddEditModal from './SearchCorpus/StoreAddEditModal'
import StoreDeleteModal from './SearchCorpus/StoreDeleteModal'

const modals = {
  example: ExampleModal,
  infoModal: InfoModal,
  loginModal: LoginModal,
  deployModal: DeployModal,
  editSpellModal: EditSpellModal,
  saveAsModal: SaveAsModal,
  documentAddModal: DocumentAddModal,
  documentEditModal: DocumentEditModal,
  documentStoreAddEditModal: StoreAddEditModal,
  documentStoreDeleteModal: StoreDeleteModal
}

export const getModals = () => {
  return modals
}
