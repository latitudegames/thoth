import React, { useState } from "react";

import css from "./sidepanel.module.css";
import Hieroglyphs from "./Hieroglyphs";
import Playtest from "./Playtest";
import StateManager from "./StateManager";

const ThothSidePanel = ({ nodeList, nodeMap, editor, ...props }) => {
  const [activeTab, setActiveTab] = useState("stateManager");
  const tabs = {
    spellBrowser: {
      title: "Hieroglyphs",
      component: (
        <Hieroglyphs nodeMap={nodeMap} nodeList={nodeList} editor={editor} />
      ),
    },
    stateManager: {
      title: "State Manager",
      component: <StateManager />,
    },
    playtest: {
      title: "Playtest",
      component: <Playtest />,
    },
  };

  return (
    <div className={css["th-sidepanel"]}>
      <div className={css["tabs"]}>
        {Object.keys(tabs).map((item, i) => {
          return (
            <div
              key={`${item}-${i}`}
              onClick={() => {
                setActiveTab(item);
              }}
              className={`${css["tab"]} ${
                css[activeTab === item ? "active" : ""]
              }`}
            >
              {tabs[item].title}
            </div>
          );
        })}
      </div>
      <div className={css["tab-page"]}>{tabs[activeTab].component}</div>
    </div>
  );
};

export default ThothSidePanel;
