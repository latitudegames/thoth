import { useEffect } from "react";

import css from "./LoginScreen.module.css";

import { useModal } from "../../contexts/ModalProvider";

const LoginScreen = () => {
  const { openModal } = useModal();

  const onClose = () => {
    alert("closed");
  };

  useEffect(() => {
    openModal({
      modal: "loginModal",
      title: "LOG IN",
      onClose,
    });
  }, []);

  return <div className={css["overlay"]}></div>;
};

export default LoginScreen;
