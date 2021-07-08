import React from "react";
// import ThothSidePanel from "../ThothSidePanel/ThothSidePanel";

import TabBar from "../TabBar/TabBar";
import css from "./pagewrapper.module.css";
import Toolbar from "../Toolbar/Toolbar";

const ThothPageWrapper = ({ toolbarItems, tabs, options, ...props }) => {
  return (
    <div className={css["wrapper"]}>
      <TabBar tabs={tabs} />
      <Toolbar toolbar={toolbarItems} options={options} />
      {/* <ThothSidePanel /> */}
      <div className={css["view-container"]}>{props.children}</div>
    </div>
  );
};
export default ThothPageWrapper;
