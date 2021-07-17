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
  const { editor } = useRete();
  const { saveSpell } = useSpell();
  const tabRef = useRef();

  // eslint-disable-next-line no-unused-vars
  const [location, setLocation] = useLocation();

  const [tabs, setTabs] = useState(null);
  const [activeTab, setActiveTab] = useState(null);

  const updateActiveTab = (activeTab) => {
    tabRef.current = activeTab;
    setActiveTab(activeTab);
  };

  useEffect(() => {
    if (location !== "/thoth") setLocation("/thoth");
  }, [activeTab]);

  useEffect(() => {
    if (!editor) return;
    editor.on(
      "process nodecreated noderemoved connectioncreated connectionremoved",
      () => {
        // Use a tab ref here because otherwise the state is stale inside the callback function.
        // Handy pattern to remember when wanting to set things like callbacks, etc.
        saveSpell(tabRef.current.spell, { graph: editor.toJSON() });
      }
    );
  }, [editor]);

  useEffect(() => {
    if (!db) return;

    db.tabs.find().$.subscribe((results) => {
      setTabs(results.map((tab) => tab.toJSON()));
    });

    db.tabs.findOne({ selector: { active: true } }).$.subscribe((result) => {
      if (!result) return;
      updateActiveTab(result.toJSON());
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
