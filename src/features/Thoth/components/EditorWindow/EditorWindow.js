import { Editor, useRete } from "../../../../contexts/ReteProvider";
import { createNode } from "rete-context-menu-plugin/src/utils";
import Select from "../../../common/Select/Select";

import css from "./editorwindow.module.css";

const EditorWindow = ({ tab, ...props }) => {
  const { getNodes, getNodeMap, editor } = useRete();

  const nodeList = getNodes();
  const nodeMap = getNodeMap();

  const handleNodeSelect = async (e) => {
    if (editor)
      editor.addNode(
        await createNode(nodeMap.get(e.value), {
          x: 0,
          y: 0,
        })
      );
  };

  const getNodeOptions = () => {
    const arr = [];
    if (nodeList)
      Object.keys(nodeList).map((item, index) => {
        return arr.push({
          label: nodeList[item].name,
          value: nodeList[item].name,
        });
      });
    return arr;
  };

  const EditorToolbar = () => {
    return (
      <>
        <Select
          searchable
          placeholder={"add node..."}
          onChange={async (e) => {
            handleNodeSelect(e);
          }}
          options={getNodeOptions()}
          style={{ width: "50%" }}
          value={null}
          focusKey="cmd+p, ctl+p"
        />
      </>
    );
  };

  return (
    <div className={css["editor-container"]}>
      <div className={css["editor-toolbar"]}>
        <EditorToolbar />
      </div>
      <Editor tab={tab} />
    </div>
  );
};

export default EditorWindow;
