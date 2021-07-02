import { useState, useEffect } from "react";
import jsonFormat from "json-format";
import Editor from "react-simple-code-editor";

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prism-themes/themes/prism-synthwave84.css";

import css from "./sidepanel.module.css";

import { useThoth } from "../../contexts/Thoth";

const StateManager = ({ ...props }) => {
  const { currentGameState, rewriteCurrentGameState } = useThoth();
  const [code, setCode] = useState("{}");

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

  return (
    <>
      <div className={css["code-editor"]}>
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => {
            return highlight(code, languages.json);
          }}
          padding={10}
        />
      </div>
      <div className={css["input"]}>
        <button className="secondary" onClick={onClear}>
          Clear
        </button>
        <button className="primary" onClick={onSave}>
          Save
        </button>
      </div>
    </>
  );
};

export default StateManager;
