import { useState, useEffect } from "react";
import jsonFormat from "json-format";
import Editor from "@monaco-editor/react";
import { Flex, Box } from "rebass";

import css from "./windows.module.css";

import { useThoth } from "../../contexts/Thoth";

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
    suggest: {
      preview: false,
    },
    // automaticLayout: true,
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

  return (
    <Flex flexDirection="column" css={{ height: "100%", minHeight: 0 }}>
      <Editor
        theme="vs-dark"
        height={height}
        defaultLanguage="json"
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={setCode}
      />
      <Box
        className={css["bottom-container"]}
        css={{ height: bottomHeight }}
        flex={1}
      >
        <button className="primary" onClick={onSave}>
          Save
        </button>
        <button className="secondary" onClick={onClear}>
          Clear
        </button>
      </Box>
    </Flex>
  );
};

export default StateManager;
