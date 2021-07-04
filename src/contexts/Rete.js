import init from "../rete/editor";
import gridimg from "../grid.png";

import { usePubSub } from "./PubSub";
import { useThoth } from "./Thoth";

import { useContext, createContext, useState, useEffect } from "react";

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
  const { publish, subscribe, events } = pubSub;

  useEffect(() => {
    if (editor?.on) {
      // whenever a node is selected, we publish a notification to the inspector
      editor.on("nodeselect", (node) => {
        publish(events.INSPECTOR_SET, {
          name: node.name,
          nodeId: node.id,
          data: node.data,
        });

        // we set up a subscribe to that nodes channel when it saves data.
        subscribe(events.NODE_SET(node.id), (event, { data }) => {
          node.data = data;

          if (node.onInspector) {
            node.onInspector(data);
          }
          node.update();
        });
      });
    }
  }, [editor, events, publish, subscribe]);

  const buildEditor = async (container, thoth) => {
    if (editor) return;

    const newEditor = await init({
      container,
      pubSub,
      thoth,
    });
    setEditor(newEditor);
  };

  const run = () => {
    console.log("RUN");
  };

  const serialize = () => {
    return editor.toJSON();
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
  const thoth = useThoth();

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
        {!thoth.currentSpell.graph && <p>Loading...</p>}
        {thoth.currentSpell.graph && (
          <div
            ref={(el) => {
              if (el) buildEditor(el, thoth);
            }}
          />
        )}
      </div>
      {children}
    </>
  );
};

export default ReteProvider;
