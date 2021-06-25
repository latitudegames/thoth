import { useState, useEffect, useCallback } from "react";
import { usePubSub } from "../../contexts/PubSub";

import css from "./sidepanel.module.css";

const Playtest = ({ ...props }) => {
  const [history, setHistory] = useState([]);
  const [value, setValue] = useState("");

  const { publish, subscribe, events } = usePubSub();

  const { INPUT_CONSOLE, PRINT_CONSOLE } = events;

  const printToConsole = useCallback(
    (_, text) => {
      console.log("message received!");
      const newHistory = [...history, text];
      setHistory(newHistory);
    },
    [history]
  );

  useEffect(() => {
    const unsubscribe = subscribe(PRINT_CONSOLE, printToConsole);

    // return a clean up function
    return unsubscribe;
  }, [subscribe, printToConsole, PRINT_CONSOLE]);

  const printItem = (text, key) => <p key={key}>{text}</p>;

  const publishInput = () => {
    const newHistory = [...history, `You: ${value}`];
    setHistory(newHistory);
    publish(INPUT_CONSOLE, value);
    setValue("");
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  return (
    <>
      <div className={css["playtest-output"]}>
        <ul>{history.map(printItem)}</ul>
      </div>
      <div className={css["input"]}>
        <input type="text" value={value} onChange={onChange}></input>
        <button className="primary" onClick={publishInput}>
          Send
        </button>
      </div>
    </>
  );
};

export default Playtest;
