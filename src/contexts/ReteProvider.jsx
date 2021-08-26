import { useContext, createContext } from "react";

import { completion as _completion } from "../features/rete/utils/openaiHelper";
import { usePubSub } from "./PubSubProvider";
import { useDB } from "./DatabaseProvider";

/* 
Some notes here.  The new rete provider, not to be foncused with the old rete provider renamed to the editor provider, is designed to serve as the single source of truth for interfacing with the rete internal system.  This unified interface will lso allow us to replicate the same API in the server, where rete expects certain function to exist but doesn't care what is behind these functions to long as they work.
Not all functions will be needed on the server, anf functions which are not will be labeled as such.
*/

const Context = createContext({
  onInspector: () => {},
  onPlayTest: () => {},
  onGameState: () => {},
  sendToPlaytest: () => {},
  sendToInspector: () => {},
  clearTextEditor: () => {},
  getSpell: () => {},
  getModule: () => {},
  getGameState: () => {},
  setGameState: () => {},
  getModules: async () => {},
  completion: async () => {},
});

export const useRete = () => useContext(Context);

const ReteProvider = ({ children, tab }) => {
  const { events, publish, subscribe } = usePubSub();
  const {
    models: { spells, modules },
  } = useDB();

  const {
    $PLAYTEST_INPUT,
    $PLAYTEST_PRINT,
    $INSPECTOR_SET,
    $TEXT_EDITOR_CLEAR,
    $NODE_SET,
  } = events;

  const onInspector = (node, callback) => {
    return subscribe($NODE_SET(tab.id, node.id), (event, data) => {
      callback(data);
    });
  };

  const sendToInspector = (data) => {
    publish($INSPECTOR_SET(tab.id), data);
  };

  const sendToPlaytest = (data) => {
    publish($PLAYTEST_PRINT(tab.id), data);
  };

  const onPlaytest = (callback) => {
    return subscribe($PLAYTEST_INPUT(tab.id), (event, data) => {
      callback(data);
    });
  };

  const completion = async (body) => {
    return _completion(body);
  };

  const clearTextEditor = () => {
    publish($TEXT_EDITOR_CLEAR(tab.id));
  };

  const publicInterface = {
    onInspector,
    sendToInspector,
    sendToPlaytest,
    onPlaytest,
    clearTextEditor,
    completion,
    ...modules,
    ...spells,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ReteProvider;
