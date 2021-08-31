import PubSub from "pubsub-js";
import { useContext, createContext } from "react";

const Context = createContext({
  publish: () => {},
  subscribe: () => {},
  PubSub: () => {},
  events: {},
});

export const usePubSub = () => useContext(Context);

export { PubSub };

// Might want to namespace these
export const events = {
  $PLAYTEST_INPUT: (tabId) => `playtestInput:${tabId}`,
  $PLAYTEST_PRINT: (tabId) => `playtestPrint:${tabId}`,
  $INSPECTOR_SET: (tabId) => `inspectorSet:${tabId}`,
  $TEXT_EDITOR_SET: (tabId) => `textEditorSet:${tabId}`,
  $TEXT_EDITOR_CLEAR: (tabId) => `textEditorClear:${tabId}`,
  $CLOSE_EDITOR: (tabId) => `closeEditor:${tabId}`,
  $NODE_SET: (tabId, nodeId) => `nodeSet:${tabId}:${nodeId}`,
  $SAVE_SPELL: (tabId) => `saveSpell:${tabId}`,
  $CREATE_STATE_MANAGER: (tabId) => `createStateManage:${tabId}`,
  $CREATE_PLAYTEST: (tabId) => `createPlaytest:${tabId}`,
  $CREATE_INSPECTOR: (tabId) => `createInspector:${tabId}`,
  $CREATE_TEXT_EDITOR: (tabId) => `createTextEditor:${tabId}`,
  $SERIALIZE: (tabId) => `serialize:${tabId}`,
  $EXPORT: (tabId) => `export:${tabId}`,
  $UNDO: (tabId) => `undo:${tabId}`,
  $REDO: (tabId) => `redo:${tabId}`,
};

const PubSubProvider = ({ children }) => {
  const publish = (event, data) => {
    return PubSub.publish(event, data);
  };

  const subscribe = (event, callback) => {
    const token = PubSub.subscribe(event, callback);

    return () => {
      PubSub.unsubscribe(token);
    };
  };

  const publicInterface = {
    publish,
    subscribe,
    events,
    PubSub,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default PubSubProvider;
