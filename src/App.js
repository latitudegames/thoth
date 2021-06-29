import { useRete, Editor } from "./contexts/Rete";
import { useThoth } from "./contexts/Spell/index";
import ThothPageWrapper from "./components/ThothPage/ThothPageWrapper";

import "./dds-globals/dds-globals.css";
import "./App.css";

function App() {
  const { serialize } = useRete();
  const { currentSpell } = useThoth();

  const toolbar = (
    <>
      <button>Load</button>
      <button onClick={serialize}>Export</button>
      <button onClick={serialize}>Create New</button>
    </>
  );

  return (
    <ThothPageWrapper toolbarItems={toolbar}>
      <Editor defaultState={currentSpell.graph} />
    </ThothPageWrapper>
  );
}

export default App;
