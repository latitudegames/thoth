import Modal from "../Modal/Modal";

const LoginModal = ({ title, content, onClose, options }) => {
  return (
    <Modal title={title} icon="info" onClose={onClose} options={options}>
      <p style={{ whiteSpace: "pre-line" }}> {content} </p>
    </Modal>
  );
};

export default LoginModal;
