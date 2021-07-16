import { useContext, createContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useDB } from "./Database";
import { useLayout } from "./Layout";

const Context = createContext({
  tabs: [],
  activeTab: {},
});

export const useTabManager = () => useContext(Context);

const TabManager = ({ children }) => {
  const { db } = useDB();
  const { getWorkspace } = useLayout();

  const [tabs, setTabs] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (!db) return;

    db.tabs.find().$.subscribe((results) => {
      setTabs(results);
    });

    db.tabs.findOne({ selector: { active: true } }).$.subscribe((result) => {
      if (!result) return;
      setActiveTab(result);
    });
  }, [db]);

  const openTab = async ({
    workspace = "default",
    name = "My Spell",
    spellId,
  }) => {
    const newTab = {
      layoutJson: getWorkspace(workspace),
      name,
      id: uuidv4(),
      spell: spellId,
      type: "spell",
      active: true,
    };

    const tab = await db.tabs.insert(newTab);
    setActiveTab(tab);
    return tab;
  };

  // const closeTab = () => {};

  // const switchTab = () => {};

  const publicInterface = {
    tabs,
    activeTab,
    openTab,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default TabManager;
