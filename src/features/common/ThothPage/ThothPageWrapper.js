import React from "react";
// import ThothSidePanel from "../ThothSidePanel/ThothSidePanel";

import TabBar from "../TabBar/TabBar";
import css from "./pagewrapper.module.css";

const ThothPageWrapper = ({ toolbarItems, tabs, options, ...props }) => {
  return (
    <div className={css["wrapper"]}>
      <TabBar tabs={tabs} />
      {props.children}
    </div>
  );
};
export default ThothPageWrapper;
