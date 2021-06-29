import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDB } from "react-pouchdb";

import { useRete } from "../Rete";
import defaultSpellData from "./defaultSpell";

const Context = createContext({
  settings: {},
  currentSpell: {},
  setCurrentSpell: {},
  loadSpell: () => {},
  saveSpell: () => {},
  getSpell: () => {},
  saveCurrentSpell: () => {},
  getCurrentState: () => {},
  updateCurrentState: () => {},
});

export const useThoth = () => useContext(Context);

const ThothProvider = ({ children }) => {
  const db = useDB();
  const { editor } = useRete();

  const [currentSpell, setCurrentSpellState] = useState({});
  const [settings, setSettings] = useState({});

  const setCurrentSpell = useCallback(
    async (spell) => {
      const settings = await db.get("settings");
      settings.currentSpell = spell;
      await db.put(settings);
      setCurrentSpellState(spell);
    },
    [db]
  );

  useEffect(() => {
    if (!db) return;

    // load initial settings
    (async () => {
      const settings = await db.get("settings").catch((err) => {
        if (err.name === "not_found") {
          return {
            _id: "config",
            currentSpell: "defaultSpell",
          };
        }
      });

      setSettings(settings);

      const defaultSpell = await db.get("defaultSpell").catch((err) => {
        if (err.name === "not_found") {
          return defaultSpellData;
        }
      });

      setCurrentSpellState(defaultSpell);
    })();
  }, [db, setCurrentSpell]);

  const loadSpell = async (spellId) => {
    const spell = getSpell(spellId);
    setCurrentSpell(spell);
    editor.loadGraph(spell.graph);
  };

  const getSpell = async (spellId) => {
    const spell = await db.get(spellId);
    return spell;
  };

  const saveSpell = async (spellId, update) => {
    const spell = await getSpell(spellId);
    const newSpell = {
      ...spell,
      ...update,
    };

    return db.put(newSpell);
  };

  const saveCurrentSpell = async (update) => {
    return saveSpell(currentSpell._id, update);
  };

  const getCurrentState = async () => {
    const currentSpell = await getSpell(settings.currentSpell);
    return currentSpell.gameState;
  };

  const updateCurrentState = async (state) => {
    const currentSpell = await getSpell(settings.currentSpell);
    currentSpell.gameState = state;
    await db.put(currentSpell);
    setCurrentSpellState(currentSpell);
    return currentSpell;
  };

  // Check for existing currentSpell in the db
  const publicInterface = {
    currentSpell,
    setCurrentSpell,
    settings,
    loadSpell,
    saveSpell,
    getSpell,
    saveCurrentSpell,
    getCurrentState,
    updateCurrentState,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ThothProvider;
