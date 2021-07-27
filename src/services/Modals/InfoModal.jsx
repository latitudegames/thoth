import Modal from "../../features/common/Modal/Modal";

const InfoModal = ({ title, content }) => {
  return (
    <Modal title={title} icon="info">
      <p> {content} </p>
    </Modal>
  );
};

export default InfoModal;
