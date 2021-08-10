import Modal from "../../features/common/Modal/Modal";
import { useModal } from "../../contexts/ModalProvider";

const ExampleModal = ({ content }) => {
  const { closeModal } = useModal();
  const options = [
    { label: "Oki doki", className: "primary", onClick: closeModal },
  ];
  return (
    <Modal title="Example" options={options} icon="info">
      <p> {content} </p>
    </Modal>
  );
};

export default ExampleModal;
