import { useContext, createContext } from "react";

const Context = createContext({
  onInspector: () => {},
  onPlayTest: () => {},
  onGameState: () => {},
  sendToPlaytest: () => {},
  sendToInspector: () => {},
  clearTextEditor: () => {},
  getGameState: () => {},
  setGameState: () => {},
});

export const useRete = () => useContext(Context);

/* 
Some notes here.  The new rete provider, not to be foncused with the old rete provider renamed to the editor provider, is designed to serve as the single source of truth for interfacing with the rete internal system.  This unified interface will lso allow us to replicate the same API in the server, where rete expects certain function to exist but doesn't care what is behind these functions to long as they work.
Not all functions will be needed on the server, anf functions which are not will be labeled as such.
*/
const ReteProvider = ({ children }) => {
  const publicInterface = {};

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ReteProvider;
