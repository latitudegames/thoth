import { useState, useEffect } from "react";
import jsonFormat from "json-format";
import Editor from "@monaco-editor/react";
import { Flex, Box } from "rebass";

import css from "./windows.module.css";

import { useThoth } from "../../contexts/Thoth";

const StateManager = ({ ...props }) => {
  const { currentGameState, rewriteCurrentGameState } = useThoth();
  const [code, setCode] = useState("{}");

  const editorOptions = {
    lineNumbers: false,
    minimap: {
      enabled: false,
    },
    suggest: {
      preview: false,
    },
  };

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
    <Flex flexDirection="column" css={{ height: "100%" }}>
      <Editor
        height="90vh"
        theme="vs-dark"
        defaultLanguage="json"
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={setCode}
      />
      {/* <CustomScroll flex="8">
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code) => {
            return highlight(code, languages.json);
          }}
          padding={10}
        />
      </CustomScroll> */}
      <Box className={css["input"]} flex={1}>
        <button className="secondary" onClick={onClear}>
          Clear
        </button>
        <button className="primary" onClick={onSave}>
          Save
        </button>
      </Box>
    </Flex>
  );
};

export default StateManager;
