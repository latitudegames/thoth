import ExampleModal from "./ExampleModal";
import InfoModal from "./InfoModal";

const modals = { example: ExampleModal, infoModal: InfoModal };

export const getModals = () => {
  return modals;
};
