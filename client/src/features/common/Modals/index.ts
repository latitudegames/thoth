import ExampleModal from './ExampleModal'
import InfoModal from './InfoModal'
import LoginModal from './LoginModal'
import DeployModal from './DeployModal'
import EditSpellModal from './EditSpellModal'

const modals = {
  example: ExampleModal,
  infoModal: InfoModal,
  loginModal: LoginModal,
  deployModal: DeployModal,
  editSpellModal: EditSpellModal,
}

export const getModals = () => {
  return modals
}
