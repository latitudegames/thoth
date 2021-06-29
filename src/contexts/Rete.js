import init from "../rete/editor";
import gridimg from "../grid.png";

import { usePubSub } from "./PubSub";
import { useThoth } from "./Thoth";

import { useContext, createContext, useState } from "react";

const Context = createContext({
  run: () => {},
  editor: {},
  serialize: () => {},
  buildEditor: () => {},
  setEditor: () => {},
  getNodeMap: () => {},
  getNodes: () => {},
  loadGraph: () => {},
});

export const useRete = () => useContext(Context);

const ReteProvider = ({ children }) => {
  const [editor, setEditor] = useState();
  const pubSub = usePubSub();

  const buildEditor = async (container, defaultSpell) => {
    if (editor) return;

    const newEditor = await init({ container, pubSub, defaultSpell });
    setEditor(newEditor);
  };

  const run = () => {
    console.log("RUN");
  };

  const serialize = () => {
    console.log(JSON.stringify(editor.toJSON()));
  };

  const getNodeMap = () => {
    return editor.components;
  };

  const getNodes = () => {
    return Object.fromEntries(editor.components);
  };

  const loadGraph = (graph) => {
    editor.loadGraph(graph);
  };

  const publicInterface = {
    run,
    serialize,
    editor,
    buildEditor,
    getNodeMap,
    getNodes,
    loadGraph,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export const Editor = ({ children }) => {
  const { buildEditor } = useRete();
  const { currentSpell } = useThoth();

  return (
    <>
      <div
        style={{
          textAlign: "left",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          backgroundImage: `url('${gridimg}')`,
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {}}
      >
        {!currentSpell.graph && <p>Loading...</p>}
        {currentSpell.graph && (
          <div
            ref={(el) => {
              if (el) buildEditor(el, currentSpell.graph);
            }}
          />
        )}
      </div>
      {children}
    </>
  );
};

export default ReteProvider;
