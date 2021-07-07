import React from "react";

import css from "./toolbar.module.css";

const Toolbar = ({ ...props }) => {
  return (
    <div className={css["th-toolbar"]}>
      <div className={css["toolbar-section"]}>{props.children}</div>
    </div>
  );
};

export default Toolbar;
