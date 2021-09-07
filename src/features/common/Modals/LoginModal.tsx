import Modal from "../Modal/Modal";

const LoginModal = ({ title, content, onClose }) => {
  return (
    <Modal title={title} icon="info" onClose={onClose}>
      <p style={{ whiteSpace: "pre-line" }}> {content} </p>
    </Modal>
  );
};

export default LoginModal;
