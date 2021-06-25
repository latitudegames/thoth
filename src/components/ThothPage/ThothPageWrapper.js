import React from "react";
import ThothSidePanel from "../ThothSidePanel/ThothSidePanel";

import Toolbar from "../Toolbar/Toolbar";
import css from "./pagewrapper.module.css";

const ThothPageWrapper = ({
  toolbarItems,
  nodeMap,
  editor,
  nodeList,
  ...props
}) => {
  return (
    <div>
      <Toolbar>{toolbarItems}</Toolbar>
      <ThothSidePanel nodeMap={nodeMap} nodeList={nodeList} editor={editor} />
      {props.children}
    </div>
  );
};
export default ThothPageWrapper;
