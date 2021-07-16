import React, { useState } from "react";
import { Editor, useRete } from "../../../../contexts/Rete";
import { createNode } from "rete-context-menu-plugin/src/utils";

import css from "./editorwindow.module.css";

const EditorWindow = ({ props }) => {
  const { getNodes, getNodeMap, editor } = useRete();
  const useToggle = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);
    const toggle = React.useCallback(() => {
      setValue((v) => !v);
    }, []);
    return [value, toggle];
  };
  const [menuVisibility, togglemenuVisibility] = useToggle();
  const nodeList = getNodes();
  const nodeMap = getNodeMap();

  console.log(nodeList);
  console.log(nodeMap);

  const EditorToolbar = () => {
    return (
      <>
      <ul className>
      <li> <button>Add Node <div className={css["folder-arrow"]}> ❯ </div></button>
      <ul>
          {nodeList && Object.keys(nodeList).map((item, index) => {
            return (
              <li
                className={css["list-item"]}
                key={item}
                onClick={async () => {
                  togglemenuVisibility(menuVisibility);
                  editor.addNode(
                    await createNode(nodeMap.get(nodeList[item].name), {
                      x: 0,
                      y: 0,
                    })
                  );
                }}
              >
                {nodeList[item].name}
              </li>
            );
          })}
        </ul>
      </li>
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
