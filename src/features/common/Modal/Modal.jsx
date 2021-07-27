/* eslint-disable jsx-a11y/click-events-have-key-events */

import css from "./modal.module.css";
import { useModal } from "../../../contexts/ModalProvider";
import Icon from "../Icon/Icon";

const Modal = ({ options, title, type, icon, pro, ...props }) => {
  const { closeModal } = useModal();
  const useVertical = options.length > 1;
  return (
    <div className={css["modal-bg"]}>
      <div className={css["modal-panel"]}>
        <div className={css["modal-panel-content"]}>
          <div className={css["modal-title"]}>
            {icon && <Icon size={24} name={icon} style={{marginRight: 'var(--extraSmall)'}}/>}
            <h1
              type="header"
              size="large"
              style={{ marginBottom: "var(--small)" }}
            >
              {title}
            </h1>
          </div>
          {props.children}
        </div>
        <div
          className={`${css["modal-action-strip"]} ${
            css[useVertical && "vertical"]
          }`}
        >
          {!useVertical && (
            <button
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </button>
          )}
          {options.map((item, index) => {
            return (
              <button key={item} onClick={item.onClick} className={item.className}>
                {item.label}
              </button>
            );
          })}
          {useVertical && (
            <button
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
