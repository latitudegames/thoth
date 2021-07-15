import { useContext, createContext, useEffect } from "react";
import { useDB } from './Database';

const Context = createContext({
});

export const useTabManager = () => useContext(Context);

const TabManager = ({ children }) => {
  const db = useDB();

  useEffect(() => {
    if (!db) return

    (async () => {
      const 

    })()
  })

  const openTab = () => {}

  const closeTab = () => {}

  const switchTab = () => {}

  const publicInterface = {

  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default TabManager;
