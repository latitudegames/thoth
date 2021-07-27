import { useState, useEffect, useCallback, useRef } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Scrollbars } from "react-custom-scrollbars";
import { usePubSub } from "../../../contexts/PubSubProvider";
import Window from "../../common/Window/Window";

import css from "../thoth.module.css";

const Input = (props) => {
  const ref = useRef();
  useHotkeys(
    "return",
    () => {
      if (ref.current !== document.activeElement) return;
      props.onSend();
    },
    { enableOnTags: "INPUT" },
    [props, ref]
  );

  return (
    <div className={css["playtest-input"]}>
      <input
        ref={ref}
        type="text"
        value={props.value}
        onChange={props.onChange}
      ></input>
      <button className="small" onClick={props.onSend}>
        Send
      </button>
    </div>
  );
};

const Playtest = ({ tab, ...props }) => {
  const [history, setHistory] = useState([]);
  const [value, setValue] = useState("");

  const { publish, subscribe, events } = usePubSub();

  const { $PLAYTEST_INPUT, $PLAYTEST_PRINT } = events;

  const printToConsole = useCallback(
    (_, text) => {
      const newHistory = [...history, text];
      setHistory(newHistory);
    },
    [history]
  );

  useEffect(() => {
    const unsubscribe = subscribe($PLAYTEST_PRINT(tab.id), printToConsole);

    // return a clean up function
    return unsubscribe;
  }, [subscribe, printToConsole, $PLAYTEST_PRINT]);

  const printItem = (text, key) => <li key={key}>{text}</li>;

  const onSend = () => {
    const newHistory = [...history, `You: ${value}`];
    setHistory(newHistory);
    publish($PLAYTEST_INPUT(tab.id), value);
    setValue("");
  };

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const toolbar = (
    <>
      <button className="small">History</button>
      <button className="small">Clear</button>
    </>
  );

  return (
    <Window toolbar={toolbar}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className={css["playtest-output"]}>
          <Scrollbars>
            <ul>{history.map(printItem)}</ul>
          </Scrollbars>
        </div>
        <Input onChange={onChange} value={value} onSend={onSend} />
      </div>
    </Window>
  );
};

export default Playtest;
