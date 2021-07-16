import init from "../features/rete/editor";
import gridimg from "../grid.png";

import { usePubSub } from "./PubSub";
import { useSpell } from "./Spell";

import { useContext, createContext, useState } from "react";

const Context = createContext({
  run: () => {},
  editor: {},
  editorMap: {},
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
  const [editorMap, setEditorMap] = useState({});
  const pubSub = usePubSub();

  const buildEditor = async (container, spell, tab) => {
    if (editorMap[tab]) {
      // If we are here, we are swapping to a new editor.  Set teh editor from the map, and return.
      setEditor(editorMap[tab]);
      return;
    }

    const newEditor = await init({
      container,
      pubSub,
      thoth: spell,
    });

    // editor map to store multiple instances of  editors based on tab
    setEditorMap({
      ...editorMap,
      [tab]: newEditor,
    });

    // this should store the current editor
    setEditor(newEditor);
  };

  const run = () => {
    console.log("RUN");
  };

  const serialize = () => {
    return editor.toJSON();
  };

  const getNodeMap = () => {
    return editor && editor.components;
  };

  const getNodes = () => {
    return editor && Object.fromEntries(editor.components);
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
    editorMap,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export const Editor = ({ tab = "default", children }) => {
  const { buildEditor } = useRete();
  const spell = useSpell();

  return (
    <>
      <div
        style={{
          textAlign: "left",
          width: "100vw",
          height: "100vh",
          position: "absolute",
          backgroundColor: "#191919",
          backgroundImage: `url('${gridimg}')`,
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {}}
      >
        {!spell.currentSpell.graph && <p>Loading...</p>}
        {spell.currentSpell.graph && (
          <div
            ref={(el) => {
              if (el) buildEditor(el, spell, tab);
            }}
          />
        )}
      </div>
      {children}
    </>
  );
};

export default ReteProvider;
