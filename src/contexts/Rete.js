import init from "../features/rete/editor";
import gridimg from "../grid.png";

import { usePubSub } from "./PubSub";
import { useSpell } from "./Spell";

import { useContext, createContext, useState } from "react";
import LoadingScreen from "../features/common/LoadingScreen/LoadingScreen";

const Context = createContext({
  run: () => {},
  editor: {},
  serialize: () => {},
  buildEditor: () => {},
  setEditor: () => {},
  getNodeMap: () => {},
  getNodes: () => {},
  loadGraph: () => {},
  setContainer: () => {},
});

export const useRete = () => useContext(Context);

const ReteProvider = ({ children }) => {
  const [editor, setEditor] = useState();
  const pubSub = usePubSub();

  const buildEditor = async (container, spell, tab) => {
    const newEditor = await init({
      container,
      pubSub,
      thoth: spell,
      tab,
    });

    // set editor to the map
    setEditor(newEditor);

    const spellDoc = await spell.getSpell(tab.spell);
    newEditor.loadGraph(spellDoc.toJSON().graph);
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
    setEditor,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export const Editor = ({ tab, children }) => {
  const [loaded, setLoaded] = useState(null);
  const { buildEditor } = useRete();
  const spell = useSpell();

  if (!tab) return <LoadingScreen />;

  if (loaded && tab.active) {
  }

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
        <div
          ref={(el) => {
            if (el && !loaded) {
              buildEditor(el, spell, tab);
              setLoaded(true);
            }
          }}
        />
      </div>
      {children}
    </>
  );
};

export default ReteProvider;
