import React from "react";
// import ThothSidePanel from "../ThothSidePanel/ThothSidePanel";

import ModalProvider from '../../../contexts/ModalProvider'
import TabBar from "../TabBar/TabBar";
import css from "./pagewrapper.module.css";

const ThothPageWrapper = ({ toolbarItems, tabs, options, ...props }) => {
  return (
    <ModalProvider>
      <div className={css["wrapper"]}>
        <TabBar tabs={tabs} />
        {props.children}
      </div>
    </ModalProvider>
  );
};
export default ThothPageWrapper;
