import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useSnackbar } from "notistack";

import Window from "../../common/Window/Window";

import "../thoth.module.css";
import { useLayout } from "../../../contexts/LayoutProvider";

const TextEditor = (props) => {
  const [code, setCode] = useState("");
  const [data, setData] = useState("");
  const [height, setHeight] = useState();
  const [editorOptions, setEditorOptions] = useState();
  const [typing, setTyping] = useState(null);
  const [language, setLanguage] = useState(null);
  const { textEditorData, saveTextEditor } = useLayout();
  const { enqueueSnackbar } = useSnackbar();

  const bottomHeight = 50;
  const handleEditorWillMount = (monaco) => {
    monaco.editor.defineTheme("sds-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#272727",
      },
    });
  };

  useEffect(() => {
    const options = {
      lineNumbers: language === "javascript",
      minimap: {
        enabled: false,
      },
      suggest: {
        preview: language === "javascript",
      },
      wordWrap: "bounded",
      fontSize: 14,
      fontFamily: '"IBM Plex Mono", sans-serif !important',
    };

    setEditorOptions(options);
  }, [textEditorData, language]);

  useEffect(() => {
    setData(textEditorData);
    setCode(textEditorData.data);
    setTyping(false);

    // todo this is really gross to see.  Make the object interface cleaner.
    if (textEditorData?.control?.controls?.data?.language) {
      setLanguage(textEditorData.control.controls.data.language);
    }

    if (
      !textEditorData.data &&
      textEditorData?.control?.controls?.data?.defaultCode
    ) {
      // setCode(textEditorData.control.controls.data.defaultCode);
    }
  }, [textEditorData]);

  useEffect(() => {
    if (props?.node?.rect?.height)
      setHeight(props.node.rect.height - bottomHeight);

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener("resize", (data) => {
      setTimeout(() => setHeight(data.rect.height - bottomHeight), 0);
    });
  }, [props.node]);

  // debounce for delayed save
  useEffect(() => {
    if (!typing) return;

    const delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      onSave(code);
      setTyping(false);
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [code]);

  const onSave = (code) => {
    const update = {
      ...data,
      data: code,
    };
    setData(update);
    saveTextEditor(update);
    enqueueSnackbar("Editor saved", {
      preventDuplicate: true,
      variant: "success",
    });
  };

  const updateCode = (code) => {
    setCode(code);
    const update = {
      ...data,
      data: code,
    };
    setData(update);
    setTyping(true);
  };

  const toolbar = (
    <>
      <div style={{ flex: 1, marginTop: "var(--c1)" }}>
        {textEditorData?.name && textEditorData?.name + " - " + language}
      </div>
      <button onClick={onSave}>SAVE</button>
    </>
  );

  return (
    <Window toolbar={toolbar}>
      <Editor
        theme="sds-dark"
        height={height}
        language={language}
        defaultLanguage="javascript"
        value={code}
        options={editorOptions}
        defaultValue={code}
        onChange={updateCode}
        beforeMount={handleEditorWillMount}
      />
    </Window>
  );
};

export default TextEditor;
