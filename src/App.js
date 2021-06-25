import init from "./rete/editor";
import "./App.css";

import ThothPageWrapper from "./components/ThothPage/ThothPageWrapper";
import gridimg from './grid.png'
import './dds-globals/dds-globals.css'

function App() {
  let editor;

  const buildEditor = async (el) => {
    editor = await init(el);
  };

  const serialize = () => {
    console.log(JSON.stringify(editor.toJSON()));
  };

  const toolbar = (<><button>Load</button><button onClick={serialize}>Export</button><button onClick={serialize}>Create New</button><button className={'primary'}>Run</button></>)

  return (
    <ThothPageWrapper toolbarItems={toolbar}>
      <div style={{ textAlign: "left", width: "100vw", height: "100vh", position: 'absolute' }}>
        <div style={{backgroundImage: `url('${gridimg}')`}} ref={(el) => buildEditor(el)} />
      </div>
    </ThothPageWrapper>
  )
}

export default App;
