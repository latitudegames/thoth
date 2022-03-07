import ExampleModal from './ExampleModal'
import InfoModal from './InfoModal'
import DeployModal from './DeployModal'
import EditSpellModal from './EditSpellModal'
import SaveAsModal from './SaveAsModal'
import DocumentAddModal from './DocumentAddModal'
import DocumentEditModal from './DocumentEditModal'

const modals = {
  example: ExampleModal,
  infoModal: InfoModal,
  deployModal: DeployModal,
  editSpellModal: EditSpellModal,
  saveAsModal: SaveAsModal,
  documentAddModal: DocumentAddModal,
  documentEditModal: DocumentEditModal
}

export const getModals = () => {
  return modals
}
