import init from "../rete/editor";
import gridimg from "../grid.png";

import { useContext, createContext, useState } from "react";

const Context = createContext({
  run: () => {},
  editor: {},
  serialize: () => {},
  buildEditor: () => {},
  setEditor: () => {},
});

export const useRete = () => useContext(Context);

const ReteProvider = ({ children }) => {
  const [editor, setEditor] = useState();

  const buildEditor = async (el) => {
    console.log("BUILDING EDITOR");
    if (editor) return;

    const newEditor = await init(el);
    setEditor(newEditor);
  };

  const run = () => {
    console.log("RUN");
  };

  const serialize = () => {
    console.log(JSON.stringify(editor.toJSON()));
  };

  const publicInterface = {
    run,
    serialize,
    editor,
    buildEditor,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export const Editor = ({ children }) => {
  const { buildEditor } = useRete();

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
      >
        <div
          ref={(el) => {
            if (el) buildEditor(el);
          }}
        />
      </div>
      {children}
    </>
  );
};

export default ReteProvider;
