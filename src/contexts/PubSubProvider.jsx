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
  // workspace specific events
  PLAYTEST_INPUT: "playtestInput",
  PLAYTEST_PRINT: "playtestPrint",
  INSPECTOR_SET: "inspectorSet",
  TEXT_EDITOR_SET: "textEditorSet",
  SAVE_CURRENT_SPELL: "saveCurrentSpell",
  $NODE_SET: (nodeId) => `nodeSet:${nodeId}`,
  // app to tab workspace events
  $SAVE_SPELL: (tabId) => `saveSpell:${tabId}`,
  $CREATE_STATE_MANAGER: (tabId) => `createStateManage:${tabId}`,
  $CREATE_PLAYTEST: (tabId) => `createPlaytest:${tabId}`,
  $CREATE_INSPECTOR: (tabId) => `createInspector:${tabId}`,
  $CREATE_TEXT_EDITOR: (tabId) => `createStateManage:${tabId}`,
  $SERIALIZE: (tabId) => `serialize:${tabId}`,
  $EXPORT: (tabId) => `export:${tabId}`,
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
