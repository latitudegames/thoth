import React from "react";
// import ThothSidePanel from "../ThothSidePanel/ThothSidePanel";

import Toolbar from "../Toolbar/Toolbar";
import "./pagewrapper.module.css";

const ThothPageWrapper = ({ toolbarItems, ...props }) => {
  return (
    <div>
      <Toolbar>{toolbarItems}</Toolbar>
      {/* <ThothSidePanel /> */}
      {props.children}
    </div>
  );
};
export default ThothPageWrapper;
