import "./dds-globals/dds-globals.css";
import "./App.css";

import { useRete, Editor } from "./contexts/Rete";
import ThothPageWrapper from "./components/ThothPage/ThothPageWrapper";

function App() {
  const { serialize, editor } = useRete();

  const getNodeMap = () => {
    return editor.components;
  };

  const getNodes = () => {
    return Object.fromEntries(editor.components);
  };
  const getEditor = () => {
    return editor;
  };

  const toolbar = (
    <>
      <button>Load</button>
      <button onClick={serialize}>Export</button>
      <button onClick={serialize}>Create New</button>
    </>
  );

  return (
    <ThothPageWrapper
      toolbarItems={toolbar}
      nodeList={getNodes}
      editor={getEditor}
      nodeMap={getNodeMap}
    >
      <Editor />
    </ThothPageWrapper>
  );
}

export default App;
