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

export const events = {
  PLAYTEST_INPUT: "playtestInput",
  PLAYTEST_PRINT: "playtestPrint",
  INSPECTOR_SET: "inspectorSet",
  TEXT_EDITOR_SET: "textEditorSet",
  NODE_SET: (nodeId) => `nodeSet:${nodeId}`,
};

const PubSubProvider = ({ children }) => {
  const publish = (event, data) => {
    return PubSub.publish(event, data);
  };

  const subscribe = (event, callback) => {
    return PubSub.subscribe(event, callback);
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
