import { useState, useEffect } from "react";
import jsonFormat from "json-format";
import Editor from "@monaco-editor/react";
import Window from "../../common/Window/Window";

import "../spell.module.css";

import { useSpell } from "../../../contexts/Spell";

const StateManager = (props) => {
  const { currentGameState, rewriteCurrentGameState } = useSpell();
  const [code, setCode] = useState("{}");
  const [height, setHeight] = useState();

  const bottomHeight = 50;

  const editorOptions = {
    lineNumbers: false,
    minimap: {
      enabled: false,
    },
    fontSize: 14,
    suggest: {
      preview: false,
    },
  };

  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme('sds-dark', {
      base: 'vs-dark', 
      inherit: true,
      rules: [],
      colors: {
        "editor.background": '#272727'
      }
    });
  }

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
        theme="sds-dark"
        height={height}
        defaultLanguage="json"
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={setCode}
        beforeMount={handleEditorWillMount}
      />
    </Window>
  );
};

export default StateManager;
