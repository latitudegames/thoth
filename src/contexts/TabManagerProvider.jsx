import { useContext, createContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { v4 as uuidv4 } from "uuid";
import { useDB } from "./DatabaseProvider";

import defaultJson from "./layouts/defaultLayout.json";
import LoadingScreen from "../features/common/LoadingScreen/LoadingScreen";

const Context = createContext({
  tabs: [],
  activeTab: {},
  switchTab: () => {},
  closeTab: () => {},
});

// Map of workspaces
const workspaceMap = {
  default: defaultJson,
};

export const useTabManager = () => useContext(Context);

const TabManager = ({ children }) => {
  const { db } = useDB();

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();

  const [tabs, setTabs] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  // handle redirection when active tab changes
  useEffect(() => {
    if (location !== "/thoth") setLocation("/thoth");
  }, [activeTab]);

  // Suscribe to changes in the database for active tab, and all tabs
  useEffect(() => {
    if (!db) return;

    (async () => {
      await db.tabs
        .findOne({ selector: { active: true } })
        .$.subscribe((result) => {
          if (!result) return;

          setActiveTab(result.toJSON());
        });

      await db.tabs.find().$.subscribe((result) => {
        if (!result) return;
        // If there are no tabs, we route the person back to the home screen
        if (result.length === 0) setLocation("/home");

        setTabs(result.map((tab) => tab.toJSON()));
      });
    })();
  }, [db]);

  const openTab = async ({
    workspace = "default",
    name = "My Spell",
    spellId,
  }) => {
    const newTab = {
      layoutJson: workspaceMap[workspace],
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
    if (!tab) return;
    await tab.remove();

    // Switch to the last tab down.
    if (tabs.length === 1) return;
    switchTab(tabs[0].id);
  };

  const switchTab = async (tabId) => {
    const tab = await db.tabs.findOne({ selector: { id: tabId } }).exec();
    console.log("tab", tab);
    if (!tab) return;
    await tab.atomicPatch({ active: true });

    setActiveTab(tab.toJSON());
  };

  const publicInterface = {
    tabs,
    activeTab,
    openTab,
    switchTab,
    closeTab,
  };

  if (!tabs) return <LoadingScreen />;

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default TabManager;
