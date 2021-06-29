import { useRete, Editor } from "./contexts/Rete";
import { useThoth } from "./contexts/Thoth";
import ThothPageWrapper from "./components/ThothPage/ThothPageWrapper";

import "./dds-globals/dds-globals.css";
import "./App.css";

function App() {
  const { serialize } = useRete();
  const { saveCurrentSpell } = useThoth();

  const onSave = () => {
    const serialized = serialize();
    console.log("saving");
    saveCurrentSpell({ graph: serialized });
  };

  const toolbar = (
    <>
      <button onClick={onSave}>Save</button>
      <button>Load</button>
      <button onClick={serialize}>Export</button>
      <button onClick={serialize}>Create New</button>
    </>
  );

  return (
    <ThothPageWrapper toolbarItems={toolbar}>
      <Editor />
    </ThothPageWrapper>
  );
}

export default App;
