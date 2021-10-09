import ExampleModal from './ExampleModal'
import InfoModal from './InfoModal'
import LoginModal from './LoginModal'
import DeployModal from './DeployModal'

const modals = {
  example: ExampleModal,
  infoModal: InfoModal,
  loginModal: LoginModal,
  deployModal: DeployModal,
}

export const getModals = () => {
  return modals
}
