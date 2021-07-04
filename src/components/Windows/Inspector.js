import { useEffect, useState, useCallback } from "react";
import jsonFormat from "json-format";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-json";
import "prism-themes/themes/prism-synthwave84.css";

import { usePubSub } from "../../contexts/PubSub";

const Inspector = () => {
  const { publish, subscribe, events } = usePubSub();
  const [data, setData] = useState("");

  useEffect(() => {
    subscribe(events.INSPECTOR_SET, (event, data) => {
      setData(jsonFormat(data));
    });
  }, [events, subscribe]);

  const onSave = () => {
    const parsed = JSON.parse(data);
    publish(events.NODE_SET(parsed.nodeId), parsed);
  };

  return (
    <>
      <p>Component Data:</p>
      <Editor
        value={data}
        onValueChange={setData}
        highlight={(code) => {
          return highlight(code, languages.json);
        }}
        padding={10}
      />
      <button className="primary" onClick={onSave}>
        Save
      </button>
    </>
  );
};

export default Inspector;
