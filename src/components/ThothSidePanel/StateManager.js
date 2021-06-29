import css from "./sidepanel.module.css";

const StateManager = ({ ...props }) => {
  return (
    <>
      <div className={css["playtest-output"]}></div>
      <div className={css["input"]}>
        <input type="text"></input>
        <button className="primary">Send</button>
      </div>
    </>
  );
};

export default StateManager;
