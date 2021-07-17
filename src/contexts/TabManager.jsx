import { useContext, createContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from "uuid";
import { useDB } from "./Database";
import { useLayout } from "./Layout";

const Context = createContext({
  tabs: [],
  activeTab: {},
  switchTab: () => {},
  closeTab: () => {},
});

export const useTabManager = () => useContext(Context);

const TabManager = ({ children }) => {
  const { db } = useDB();
  const { getWorkspace } = useLayout();

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();

  const [tabs, setTabs] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    if (location !== "/thoth") setLocation("/thoth");
  }, [activeTab]);

  useEffect(() => {
    if (!db) return;

    db.tabs.find().$.subscribe((results) => {
      setTabs(results.map((tab) => tab.toJSON()));
    });

    db.tabs.findOne({ selector: { active: true } }).$.subscribe((result) => {
      if (!result) return;
      setActiveTab(result.toJSON());
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

    await db.tabs.insert(newTab);
  };

  const closeTab = async (tabId) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec();
    await tab.remove();
  };

  const switchTab = async (tabId) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec();
    await tab.atomicPatch({ active: true });
  };

  const publicInterface = {
    tabs,
    activeTab,
    openTab,
    switchTab,
    closeTab,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default TabManager;
