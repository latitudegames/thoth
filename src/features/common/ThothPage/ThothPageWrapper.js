import React from "react";
// import ThothSidePanel from "../ThothSidePanel/ThothSidePanel";

import TabBar from "../TabBar/TabBar";
import css from "./pagewrapper.module.css";
import Toolbar from "../Toolbar/Toolbar";

const ThothPageWrapper = ({ toolbarItems, tabs, ...props }) => {
  return (
    <div className={css["wrapper"]}>
      <TabBar tabs={tabs} />
      <Toolbar>{toolbarItems}</Toolbar>
      {/* <ThothSidePanel /> */}
      {props.children}
    </div>
  );
};
export default ThothPageWrapper;
