import { Layout, Model } from "flexlayout-react";
import "flexlayout-react/style/dark.css";

import { useRete, Editor } from "./contexts/Rete";
import { useThoth } from "./contexts/Thoth";
import ThothPageWrapper from "./components/ThothPage/ThothPageWrapper";
import json from "./layout.json";

import "./dds-globals/dds-globals.css";
import "./App.css";
import StateManager from "./components/Windows/StateManager";
import Playtest from "./components/Windows/Playtest";
import Inspector from "./components/Windows/Inspector";

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
      <button onClick={onSave}>Save</button>
      <button>Load</button>
      <button onClick={onSerialize}>Export</button>
      <button onClick={serialize}>Create New</button>
    </>
  );

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
    <ThothPageWrapper toolbarItems={toolbar}>
      <div className="layout-container">
        <Layout model={model} factory={factory} />
      </div>
      {/* <Editor /> */}
    </ThothPageWrapper>
  );
}

export default App;
