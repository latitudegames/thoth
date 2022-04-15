import ExampleModal from './ExampleModal'
import InfoModal from './InfoModal'
import DeployModal from './DeployModal'
import EditSpellModal from './EditSpellModal'
import SaveAsModal from './SaveAsModal'

const modals = {
  example: ExampleModal,
  infoModal: InfoModal,
  deployModal: DeployModal,
  editSpellModal: EditSpellModal,
  saveAsModal: SaveAsModal,
}

export const getModals = () => {
  return modals
}
