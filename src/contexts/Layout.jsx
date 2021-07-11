import { useContext, createContext, useEffect, useState } from "react";
import { usePubSub } from "./PubSub";
// import { useDB } from "./Database";

const Context = createContext({
  inspectorData: {},
});

export const useLayout = () => useContext(Context);

const LayoutProvider = ({ children }) => {
  const { publish, subscribe, events } = usePubSub();

  const [inspectorData, setInspectorData] = useState({});

  useEffect(() => {
    subscribe(events.INSPECTOR_SET, (event, data) => {
      console.log("changed", data);
      setInspectorData(data);
    });
  }, [events, subscribe]);

  // const db = useDB();

  const publicInterface = {
    inspectorData,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default LayoutProvider;
