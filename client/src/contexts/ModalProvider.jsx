import React, { useState } from "react";

import { getModals } from "../features/common/Modals";

const Context = React.createContext({
  activeModal: "",
  openModal: (options) => {},
  closeModal: () => {},
});

export const useModal = () => React.useContext(Context);

const ModalContext = ({ children }) => {
  const modalList = getModals();
  const [activeModal, setActiveModal] = useState("");

  const openModal = ({ modal, content, title, icon, onClose, options }) => {
    setActiveModal({ modal, content, title, onClose, options });
  };

  const closeModal = (modal) => {
    setActiveModal("");
  };
  const Modal = modalList[activeModal.modal];

  return (
    <Context.Provider
      value={{
        openModal,
        closeModal,
      }}
    >
      {activeModal && (
        <Modal
          content={activeModal.content}
          options={activeModal.options}
          title={activeModal.title}
          icon={activeModal.icon}
          onClose={activeModal.onClose}
        />
      )}
      {children}
    </Context.Provider>
  );
};

export default ModalContext;
