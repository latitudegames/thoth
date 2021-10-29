import ExampleModal from './ExampleModal'
import InfoModal from './InfoModal'
import LoginModal from './LoginModal'
import DeployModal from './DeployModal'
import EditSpellModal from './EditSpellModal'
import SaveAsModal from './SaveAsModal'

const modals = {
  example: ExampleModal,
  infoModal: InfoModal,
  loginModal: LoginModal,
  deployModal: DeployModal,
  editSpellModal: EditSpellModal,
  saveAsModal: SaveAsModal,
}

export const getModals = () => {
  return modals
}
