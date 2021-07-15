import { useContext, createContext, useEffect, useState } from "react";
import { useDB } from "./Database";

const Context = createContext({
  tabs: [],
  activeTab: {},
});

export const useTabManager = () => useContext(Context);

const TabManager = ({ children }) => {
  const { db } = useDB();

  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState({});

  useEffect(() => {
    if (!db) return;

    db.tabs.find().$.subscribe((results) => {
      setTabs(results);
    });

    db.tabs.findOne({ selector: { active: true } }).$.subscribe((result) => {
      if (!result) return;
      console.log("active tab found", result);
      setActiveTab(result);
    });
  });

  // const openTab = () => {};

  // const closeTab = () => {};

  // const switchTab = () => {};

  const publicInterface = {
    tabs,
    activeTab,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default TabManager;
