import { useContext, createContext } from "react";
import { postEnkiCompletion } from "../services/game-api/enki";
import { completion as _completion } from "../utils/openaiHelper";
import { invokeInference } from "../utils/huggingfaceHelper";
import { usePubSub } from "./PubSubProvider";
import { useDB } from "./DatabaseProvider";

/* 
Some notes here.  The new rete provider, not to be confused with the old rete provider renamed to the editor provider, is designed to serve as the single source of truth for interfacing with the rete internal system.  This unified interface will also allow us to replicate the same API in the server, where rete expects certain functions to exist but doesn't care what is behind these functions so long as they work.
Not all functions will be needed on the server, and functions which are not will be labeled as such.
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
  enkiCompletion: async () => {},
  huggingface: async () => {},
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

  const enkiCompletion = async (body) => {
    return postEnkiCompletion(body);
  };

  const huggingface = async (model, data) => {
    return invokeInference(model, data);
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
    enkiCompletion,
    huggingface,
    ...modules,
    ...spells,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ReteProvider;
