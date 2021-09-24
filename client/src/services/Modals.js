import ExampleModal from "../features/common/Modals/ExampleModal";
import InfoModal from "../features/common/Modals/InfoModal";

const modals = { example: ExampleModal, infoModal: InfoModal };

export const getModals = () => {
  return modals;
};
