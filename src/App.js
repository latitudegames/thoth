import init from "./rete/editor";
import "./App.css";


import './dds-globals/dds-globals.css'

function App() {
  let editor;

  const buildEditor = async (el) => {
    editor = await init(el);
  };

  const serialize = () => {
    console.log(JSON.stringify(editor.toJSON()));
  };

  return (
    <div className="App">
      <h1>THOTH</h1>
      <h2>Multishot Builder</h2>
      <button onClick={serialize}>serialize</button>
      <div style={{ textAlign: "left", width: "100vw", height: "100vh", position: 'absolute' }}>
        <div ref={(el) => buildEditor(el)} />
      </div>
    </div>
  );
}

export default App;
