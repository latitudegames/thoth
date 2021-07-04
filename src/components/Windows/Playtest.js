import { useState, useEffect, useCallback } from "react";
import { usePubSub } from "../../contexts/PubSub";

import css from "./windows.module.css";

const Playtest = ({ ...props }) => {
  const [history, setHistory] = useState([]);
  const [value, setValue] = useState("");

  const { publish, subscribe, events } = usePubSub();

  const { PLAYTEST_INPUT, PLAYTEST_PRINT } = events;

  const printToConsole = useCallback(
    (_, text) => {
      console.log("message received!");
      const newHistory = [...history, text];
      setHistory(newHistory);
    },
    [history]
  );

  useEffect(() => {
    const unsubscribe = subscribe(PLAYTEST_PRINT, printToConsole);

    // return a clean up function
    return unsubscribe;
  }, [subscribe, printToConsole, PLAYTEST_PRINT]);

  const printItem = (text, key) => <p key={key}>{text}</p>;

  const publishInput = () => {
    const newHistory = [...history, `You: ${value}`];
    setHistory(newHistory);
    publish(PLAYTEST_INPUT, value);
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
