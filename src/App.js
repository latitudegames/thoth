import init from "./rete/editor";

import ThothPageWrapper from "./components/ThothPage/ThothPageWrapper";
import gridimg from './grid.png'
import './dds-globals/dds-globals.css'
import "./App.css";
import { useEffect, useState } from "react";

function App() {
  let editor;
  let nodes = {};

  const buildEditor = async (el) => {
    editor = await init(el)
    // nodes = await Object.fromEntries(editor.components)
  };

  const getNodes = () => {
    return Object.fromEntries(editor.components)
  }

  useEffect(() => {
    nodes = Object.fromEntries(editor.components)
    console.log(nodes)
  })

  const serialize = () => {
    console.log(JSON.stringify(editor.toJSON()));
  };

  const toolbar = (<><button>Load</button><button onClick={serialize}>Export</button><button onClick={serialize}>Create New</button></>)

  return (
    <ThothPageWrapper toolbarItems={toolbar} nodeList={getNodes}>
      <div style={{ textAlign: "left", width: "100vw", height: "100vh", position: 'absolute', backgroundImage: `url('${gridimg}')` }}>
        <div ref={(el) => buildEditor(el)} />
      </div>
    </ThothPageWrapper>
  )
}

export default App;
