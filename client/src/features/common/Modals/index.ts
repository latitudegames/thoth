import ExampleModal from './ExampleModal'
import InfoModal from './InfoModal'
import DeployModal from './DeployModal'
import EditSpellModal from './EditSpellModal'
import SaveAsModal from './SaveAsModal'
import AgentModal from './AgentModal'
import DocumentAddModal from './DocumentAddModal'
import DocumentEditModal from './DocumentEditModal'
import DocumentDeleteModal from './DocumentDeleteModal'
import StoreAddEditModal from './SearchCorpus/StoreAddEditModal'
import StoreDeleteModal from './SearchCorpus/StoreDeleteModal'
import ContentObjEditModal from './ContentObjEditModal'

const modals = {
  example: ExampleModal,
  infoModal: InfoModal,
  deployModal: DeployModal,
  agentModal: AgentModal,
  editSpellModal: EditSpellModal,
  saveAsModal: SaveAsModal,
  documentAddModal: DocumentAddModal,
  documentEditModal: DocumentEditModal,
  documentDeleteModal: DocumentDeleteModal,
  documentStoreAddEditModal: StoreAddEditModal,
  documentStoreDeleteModal: StoreDeleteModal,
  contentObjEditModal: ContentObjEditModal
}

export const getModals = () => {
  return modals
}
