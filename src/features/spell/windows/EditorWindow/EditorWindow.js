import React from "react";
import { Editor } from "../../../../contexts/Rete";

import css from "./editorwindow.module.css";

const EditorWindow = ({ props }) => {
  const EditorToolbar = () => {
    return (
      <>
        <ul>
          <button> + add node </button>
        </ul>
      </>
    );
  };

  return (
    <div className={css["editor-container"]}>
      <div className={css["editor-toolbar"]}>
        <EditorToolbar />
      </div>
      <Editor />
    </div>
  );
};

export default EditorWindow;
