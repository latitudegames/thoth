import React from "react";
import classnames from "classnames";
import { VscClose } from "react-icons/vsc";
import MenuBar from "../MenuBar/MenuBar";

import Icon from "../Icon/Icon";

import css from "./tabBar.module.css";
import { useTabManager } from "../../../contexts/TabManagerProvider";
// import { useAuth } from "../../../contexts/AuthProvider";

const Tab = (props) => {
  const { switchTab, closeTab } = useTabManager();

  const title = `${props.type}- ${props.name}`;
  const tabClass = classnames({
    [css["tabbar-tab"]]: true,
    [css["active"]]: props.active,
    [css["inactive"]]: !props.active,
  });

  const onClick = (e) => {
    switchTab(props.id);
  };

  // Handle selecting the next tab down is none are active.
  const onClose = (e) => {
    e.stopPropagation();
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
  // const { user } = useAuth();

  return (
    <div className={css["th-tabbar"]}>
      <div className={css["tabbar-section"]}>
        <MenuBar />
      </div>
      <div className={css["tabbar-section"]}>
        {tabs && tabs.map((tab, i) => <Tab {...tab} key={i} />)}
      </div>
      <div className={css["tabbar-user"]}>
        {<Icon name="account" size={24} />}
      </div>
    </div>
  );
};

export default TabBar;
