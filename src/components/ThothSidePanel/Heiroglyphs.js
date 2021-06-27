import React from "react";
import { createNode } from "rete-context-menu-plugin/src/utils";

import { useRete } from "../../contexts/Rete";

import css from "./sidepanel.module.css";

const SpellBrowser = (props) => {
  const { getNodes, getNodeMap, editor: nodeScreen } = useRete();
  let heiroglyphList = getNodes();
  let heiroglyphMap = getNodeMap();
  return (
    <div className={css["node-grid"]}>
      {Object.keys(heiroglyphList).map((item, index) => {
        return (
          <div
            draggable
            className={css["node-grid-item"]}
            key={item}
            onClick={async () => {
              nodeScreen.addNode(
                await createNode(heiroglyphMap.get(heiroglyphList[item].name), {
                  x: 0,
                  y: 0,
                })
              );
            }}
            onDragEnd={async (e) => {
              nodeScreen.addNode(
                await createNode(heiroglyphMap.get(heiroglyphList[item].name), {
                  x: 0,
                  y: 0,
                })
              );
            }}
          >
            <div className={css["node-title"]}>{heiroglyphList[item].name}</div>
            <div className={css["node-bottom-container"]}></div>
          </div>
        );
      })}
    </div>
  );
};

export default SpellBrowser;
