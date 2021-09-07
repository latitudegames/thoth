import { useState } from "react";
import Modal from "../Modal/Modal";
import InputComponent from "../Input/Input";

const LoginModal = ({ title, onClose, options }) => {
  const [value, setValue] = useState("");

  const inputStyle = {
    flex: 6,
    marginTop: 25,
  };

  return (
    <Modal title={title} icon="info" onClose={onClose} options={options}>
      <InputComponent value={value} onChange={setValue} style={inputStyle} />
    </Modal>
  );
};

export default LoginModal;
