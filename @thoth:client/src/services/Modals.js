import ExampleModal from './Modals/ExampleModal'
import InfoModal from './Modals/InfoModal'

const modals = { example: ExampleModal, infoModal: InfoModal }

export const getModals = () => {
  return modals
}
