import "./App.css";
import init from "./editor";

function App() {
  return (
    <div className="App">
      <h1>THOTH</h1>
      <h2>Multishot Builder</h2>
      <div style={{ textAlign: "left", width: "100vw", height: "70vh" }}>
        <div ref={(el) => init(el)} />
      </div>
    </div>
  );
}

export default App;
