import React, { useState } from 'react'

import { getModals } from '../features/common/Modals'

const Context = React.createContext({
  activeModal: '',
  openModal: () => {},
  closeModal: () => {},
})

export const useModal = () => React.useContext(Context)

const ModalContext = ({ children }) => {
  const modalList = getModals()
  const [activeModal, setActiveModal] = useState('')

  const openModal = ({modal, content, title, icon}) => {
    console.log("hello")
    setActiveModal({modal, content, title})
  }

  const closeModal = modal => {
    setActiveModal('')
  }
  const Modal = modalList[activeModal.modal]

  return (
    <Context.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {activeModal && <Modal content={activeModal.content} title={activeModal.title} icon={activeModal.icon} />}
      {children}
    </Context.Provider>
  )
}

export default ModalContext
