import ExampleModal from "./ExampleModal";
import InfoModal from "./InfoModal";
import LoginModal from "./LoginModal";

const modals = {
  example: ExampleModal,
  infoModal: InfoModal,
  loginModal: LoginModal,
};

export const getModals = () => {
  return modals;
};
