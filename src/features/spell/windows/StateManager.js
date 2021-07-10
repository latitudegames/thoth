import { useState, useEffect } from "react";
import jsonFormat from "json-format";
import Editor from "@monaco-editor/react";
import Window from "../../common/Window/Window";

import "../spell.module.css";

import { useThoth } from "../../../contexts/Thoth";

const StateManager = (props) => {
  const { currentGameState, rewriteCurrentGameState } = useThoth();
  const [code, setCode] = useState("{}");
  const [height, setHeight] = useState();

  const bottomHeight = 50;

  const editorOptions = {
    lineNumbers: false,
    minimap: {
      enabled: false,
    },
    fontSize: 18,
    suggest: {
      preview: false,
    },
  };

  useEffect(() => {
    if (props?.node?.rect?.height)
      setHeight(props.node.rect.height - bottomHeight);

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener("resize", (data) => {
      setTimeout(() => setHeight(data.rect.height - bottomHeight), 0);
    });
  }, [props.node]);

  useEffect(() => {
    if (currentGameState) setCode(jsonFormat(currentGameState));
  }, [currentGameState]);

  const onClear = () => {
    const reset = `{}`;

    setCode(reset);
  };

  const onSave = () => {
    rewriteCurrentGameState(JSON.parse(code));
  };

  const toolbar = (
    <>
      <button className="small">History</button>
      <button className="small" onClick={onClear}>
        Clear
      </button>
      <button className="small" onClick={onSave}>
        Save
      </button>
    </>
  );

  return (
    <Window toolbar={toolbar}>
      <Editor
        theme="vs-dark"
        height={height}
        defaultLanguage="json"
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={setCode}
      />
    </Window>
  );
};

export default StateManager;
