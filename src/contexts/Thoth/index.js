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
  currentGameState: {},
  getCurrentGameState: () => {},
  updateCurrentGameState: () => {},
});

export const useThoth = () => useContext(Context);

const ThothProvider = ({ children }) => {
  const db = useDB();
  const { editor } = useRete();

  const [currentSpell, setCurrentSpellState] = useState({});
  const [currentGameState, setCurrentGameState] = useState({});
  const [settings, setSettings] = useState({});

  const setCurrentSpell = useCallback(
    async (spell) => {
      const settings = await db.get("settings");
      settings.currentSpell = spell;
      await db.put(settings);
      setCurrentSpellState(spell);
      setCurrentGameState(spell.gameState);
    },
    [db]
  );

  useEffect(() => {
    if (!db) return;

    // load initial settings
    (async () => {
      const settings = await db.get("settings").catch(async (err) => {
        console.log("SETTINGS NOT FOUND");
        if (err.name === "not_found") {
          const settings = {
            _id: "settings",
            currentSpell: "defaultSpell",
          };

          await db.put(settings);
          return settings;
        }
      });

      setSettings(settings);

      const defaultSpell = await db.get("defaultSpell").catch(async (err) => {
        if (err.name === "not_found") {
          await db.put(defaultSpellData);
          return defaultSpellData;
        }
      });

      console.log("Default spell", defaultSpell);
      setCurrentSpellState(defaultSpell);
      setCurrentGameState(defaultSpell.gameState);
    })();
  }, [db, setCurrentSpell]);

  const loadSpell = async (spellId) => {
    const spell = getSpell(spellId);
    setCurrentSpell(spell);
    setCurrentGameState(spell.gameState);
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

  const getCurrentGameState = async () => {
    const spell = await getSpell(currentSpell._id);
    return spell.gameState;
  };

  const updateCurrentGameState = async (update) => {
    const currentSpell = await getSpell(settings.currentSpell);
    currentSpell.gameState = {
      ...currentSpell.gameState,
      ...update,
    };
    await db.put(currentSpell);
    setCurrentSpellState(currentSpell);
    setCurrentGameState(currentSpell.gameState);
    return currentSpell;
  };

  // Check for existing currentSpell in the db
  const publicInterface = {
    currentSpell,
    getSpell,
    setCurrentSpell,
    currentGameState,
    loadSpell,
    settings,
    saveCurrentSpell,
    saveSpell,
    updateCurrentGameState,
    getCurrentGameState,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ThothProvider;
