import { useForm } from "react-hook-form";
import Modal from "../Modal/Modal";

import css from "./loginModal.module.css";

const LoginModal = ({ title, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => console.log(data));

  const options = [
    {
      className: `${css["loginButton"]} primary`,
      label: "login",
      onClick: onSubmit,
    },
  ];

  return (
    <Modal title={title} icon="info" onClose={onClose} options={options}>
      <div className={css["loginContainer"]}>
        <form>
          {/* register your input into the hook by invoking the "register" function */}
          <div className={css["inputContainer"]}>
            <label className={css["label"]} htmlFor="">
              Email
            </label>
            <input
              type="text"
              className={css["input"]}
              defaultValue="test"
              {...register("email", { required: true })}
            />
          </div>

          {/* include validation with required or other standard HTML validation rules */}
          <div className={css["inputContainer"]}>
            <label className={css["label"]} htmlFor="">
              Password
            </label>
            <input
              type="text"
              className={css["input"]}
              {...register("password", { required: true })}
            />
          </div>
          {/* errors will return when field validation fails  */}
          {errors.password && <span>This field is required</span>}
        </form>
      </div>
    </Modal>
  );
};

export default LoginModal;
