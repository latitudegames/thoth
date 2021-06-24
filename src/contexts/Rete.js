import init from "../rete/editor";

import { useContext, createContext } from "react";

const Context = createContext({
  run: () => {},
  editor: {},
  serialize: () => {},
});

export const useRete = () => useContext(Context);

const ReteProvider = ({ children }) => {
  let editor;

  const buildEditor = async (el) => {
    editor = await init(el);
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
  };

  return (
    <Context.Provider value={publicInterface}>
      <div
        style={{
          textAlign: "left",
          width: "100vw",
          height: "100vh",
          position: "absolute",
        }}
      >
        <div ref={(el) => buildEditor(el)} />
      </div>

      {children}
    </Context.Provider>
  );
};

export default ReteProvider;
