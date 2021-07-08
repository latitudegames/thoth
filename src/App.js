import { Layout, Model } from "flexlayout-react";
import "flexlayout-react/style/dark.css";

import { useRete, Editor } from "./contexts/Rete";
import { useThoth } from "./contexts/Thoth";
import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import json from "./layout.json";

import "./dds-globals/dds-globals.css";
import "./App.css";

import StateManager from "./features/project/windows/StateManager";
import Playtest from "./features/project/windows/Playtest";
import Inspector from "./features/project/windows/Inspector";

const model = Model.fromJson(json);

function App() {
  const { serialize } = useRete();
  const { saveCurrentSpell } = useThoth();

  const onSave = () => {
    const serialized = serialize();
    saveCurrentSpell({ graph: serialized });
  };

  const onSerialize = () => {
    const serialized = serialize();
    console.log(JSON.stringify(serialized));
  };

  const toolbar = (
    <>
      <button className="option" onClick={onSave}>
        Save
      </button>
      <button className="option">Load</button>
      <button className="option" onClick={onSerialize}>
        Export
      </button>
    </>
  );

  const options = (
    <>
      <button className="option">State Manager</button>
      <button className="option">Playtest</button>
      <button className="option">Inspector</button>
    </>
  );

  const tabs = [
    {
      name: "My Project",
      type: "Project",
      active: true,
    },
    {
      name: "My Enki",
      type: "Enki",
      active: false,
    },
  ];

  const factory = (node) => {
    const component = node.getComponent();
    switch (component) {
      case "editor":
        return <Editor />;
      case "stateManager":
        return <StateManager node={node} />;
      case "playtest":
        return <Playtest />;
      case "inspector":
        return <Inspector node={node} />;
      default:
        return <p></p>;
    }
  };

  return (
    <ThothPageWrapper toolbarItems={toolbar} tabs={tabs} options={options}>
      <div className="layout-container">
        <Layout model={model} factory={factory} />
      </div>
      {/* <Editor /> */}
    </ThothPageWrapper>
  );
}

export default App;
