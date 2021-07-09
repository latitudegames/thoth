import "flexlayout-react/style/dark.css";

import { useRete, Editor } from "./contexts/Rete";
import { useThoth } from "./contexts/Thoth";
import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Project from "./features/project/Project";

import "./dds-globals/dds-globals.css";
import "./App.css";

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

  return (
    <ThothPageWrapper toolbarItems={toolbar} tabs={tabs} options={options}>
      <Project />
    </ThothPageWrapper>
  );
}

export default App;
