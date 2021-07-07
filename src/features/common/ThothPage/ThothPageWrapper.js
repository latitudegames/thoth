import React from "react";
// import ThothSidePanel from "../ThothSidePanel/ThothSidePanel";

import TabBar from "../TabBar/TabBar";
import "./pagewrapper.module.css";

const ThothPageWrapper = ({ toolbarItems, ...props }) => {
  return (
    <div>
      <TabBar>{toolbarItems}</TabBar>
      {/* <ThothSidePanel /> */}
      {props.children}
    </div>
  );
};
export default ThothPageWrapper;
