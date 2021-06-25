import init from "./rete/editor";

import ThothPageWrapper from "./components/ThothPage/ThothPageWrapper";
import gridimg from './grid.png'
import './dds-globals/dds-globals.css'
import "./App.css";

function App() {
  let editor;

  const buildEditor = async (el) => {
    editor = await init(el)
  };

  const getNodes = () => {
    return Object.fromEntries(editor.components)
  }
  const getEditor = () => {
    return editor
  }

  const serialize = () => {
    console.log(JSON.stringify(editor.toJSON()));
  };

  const toolbar = (<><button>Load</button><button onClick={serialize}>Export</button><button onClick={serialize}>Create New</button></>)

  return (
    <ThothPageWrapper toolbarItems={toolbar} nodeList={getNodes} editor={getEditor}>
      <div style={{ textAlign: "left", width: "100vw", height: "100vh", position: 'absolute', backgroundImage: `url('${gridimg}')` }}>
        <div ref={(el) => buildEditor(el)} />
      </div>
    </ThothPageWrapper>
  )
}

export default App;
