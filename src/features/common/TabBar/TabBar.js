import React from "react";
import classnames from "classnames";
import { VscClose } from "react-icons/vsc";
import MenuBar from "../MenuBar/MenuBar";

import css from "./tabBar.module.css";
import { useTabManager } from "../../../contexts/TabManager";

const Tab = (props) => {
  const { switchTab, closeTab } = useTabManager();

  const title = `${props.type}- ${props.name}`;
  const tabClass = classnames({
    [css["tabbar-tab"]]: true,
    [css["active"]]: props.active,
    [css["inactive"]]: !props.active,
  });

  const onClick = () => {
    switchTab(props.id);
  };

  // Handle selecting the next tab down is none are active.
  const onClose = () => {
    closeTab(props.id);
  };

  return (
    <div className={tabClass} onClick={onClick}>
      <p>{title}</p>
      <span onClick={onClose}>
        <VscClose />
      </span>
    </div>
  );
};

const TabBar = ({ tabs }) => {
  return (
    <div className={css["th-tabbar"]}>
      <div className={css["tabbar-section"]}>
        <MenuBar />
      </div>
      <div className={css["tabbar-section"]}>
        {tabs && tabs.map((tab, i) => <Tab {...tab} key={i} />)}
      </div>
    </div>
  );
};

export default TabBar;
