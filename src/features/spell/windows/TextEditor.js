import { useState, useEffect } from "react";
// import jsonFormat from "json-format";
import Editor from "@monaco-editor/react";
import { usePubSub } from "../../../contexts/PubSub";
import Window from "../../common/Window/Window";

import "../spell.module.css";

const TextEditor = (props) => {
  const [code, setCode] = useState("");
  const [data, setData] = useState("");
  const [height, setHeight] = useState();
  const { publish, subscribe, events } = usePubSub();

  const bottomHeight = 50;

  const editorOptions = {
    lineNumbers: false,
    minimap: {
      enabled: false,
    },
    suggest: {
      preview: false,
    },
    fontSize: 18,
    // automaticLayout: true,
  };

  useEffect(() => {
    subscribe(events.INSPECTOR_SET, (event, data) => {
      setData(data);

      console.log("Data!", data);
    });
  }, [events, subscribe]);

  useEffect(() => {
    if (props?.node?.rect?.height)
      setHeight(props.node.rect.height - bottomHeight);

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener("resize", (data) => {
      setTimeout(() => setHeight(data.rect.height - bottomHeight), 0);
    });
  }, [props.node]);

  const onClear = () => {
    const reset = ``;

    setCode(reset);
  };

  const onSave = () => {
    publish(events.NODE_SET(data.nodeId), data.data);
  };

  const toolbar = (
    <>
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
        defaultLanguage="plaintext"
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={setCode}
      />
    </Window>
  );
};

export default TextEditor;
