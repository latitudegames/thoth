import React from "react";
import { createNode } from "rete-context-menu-plugin/src/utils";

import { useRete } from "../../contexts/Rete";

import css from "./sidepanel.module.css";

const HieroglyphBrowser = (props) => {
  const { getNodes, getNodeMap, editor: nodeScreen } = useRete();
  let hieroglyphList = getNodes();
  let hieroglyphMap = getNodeMap();
  return (
    <div className={css["node-grid"]}>
      {Object.keys(hieroglyphList).map((item, index) => {
        return (
          <div
            draggable
            className={css["node-grid-item"]}
            key={item}
            onClick={async () => {
              nodeScreen.addNode(
                await createNode(hieroglyphMap.get(hieroglyphList[item].name), {
                  x: 0,
                  y: 0,
                })
              );
            }}
            onDragEnd={async (e) => {
              nodeScreen.addNode(
                await createNode(hieroglyphMap.get(hieroglyphList[item].name), {
                  x: 0,
                  y: 0,
                })
              );
            }}
          >
            <div className={css["node-title"]}>{hieroglyphList[item].name}</div>
            <div className={css["node-bottom-container"]}></div>
          </div>
        );
      })}
    </div>
  );
};

export default HieroglyphBrowser;
