import { useEffect } from "react";

import css from "./LoginScreen.module.css";

import { useModal } from "../../contexts/ModalProvider";

const LoginScreen = () => {
  const { openModal } = useModal();

  const onClose = () => {
    alert("closed");
  };

  const onLogin = () => {
    alert("Login");
  };

  const options = [
    {
      label: "Login",
      className: "loginButton",
      onClick: onLogin,
    },
  ];

  useEffect(() => {
    openModal({
      modal: "loginModal",
      title: "LOG IN",
      options,
      onClose,
    });
  }, []);

  return <div className={css["overlay"]}></div>;
};

export default LoginScreen;
