import { useContext, createContext, useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from "uuid";
import { useDB } from "./Database";
import { useLayout } from "./Layout";
import { useRete } from "./Rete";
import { useSpell } from "./Spell";

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
  const tabRef = useRef();

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();

  const [tabs, setTabs] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const updateActiveTab = (activeTab) => {
    tabRef.current = activeTab;
    setActiveTab(activeTab);
  };

  // handle redirection when active tab changes
  useEffect(() => {
    if (location !== "/thoth") setLocation("/thoth");
  }, [activeTab]);

  // handle setting up autosave

  // Suscribe to changes in the database for active tab, and all tabs
  useEffect(() => {
    if (!db) return;

    (async () => {
      const tabs = await db.tabs.find().exec();
      const activeTab = await db.tabs
        .findOne({ selector: { active: true } })
        .exec();

      if (tabs?.length > 0) setTabs(tabs.map((tab) => tab.toJSON()));
      if (activeTab) setActiveTab(activeTab.toJSON());
    })();
  }, [db]);

  const updateTabs = async () => {
    const tabs = await db.tabs.find().exec();
    if (tabs?.length > 0) setTabs(tabs.map((tab) => tab.toJSON()));
  };

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
    await updateTabs();
  };

  const closeTab = async (tabId) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec();
    await tab.remove();
  };

  const switchTab = async (tabId) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec();
    await tab.atomicPatch({ active: true });

    updateActiveTab(tab.toJSON());
    await updateTabs();
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
