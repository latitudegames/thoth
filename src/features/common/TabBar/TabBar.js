import React from "react";

import css from "./tabBar.module.css";
import thothlogo from "./thoth.png";

const TabBar = ({ ...props }) => {
  return (
    <div className={css["th-tabbar"]}>
      <div className={css["tabbar-section"]}>
        <img className={css["thoth-logo"]} alt="Thoth logo" src={thothlogo} />
      </div>
      <div className={css["tabbar-section"]}>{props.children}</div>
    </div>
  );
};

export default TabBar;
