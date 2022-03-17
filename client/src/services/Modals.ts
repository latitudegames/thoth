import ExampleModal from '../components/Modals/ExampleModal'
import InfoModal from '../components/Modals/InfoModal'

const modals = { example: ExampleModal, infoModal: InfoModal }

export const getModals = () => {
  return modals
}
