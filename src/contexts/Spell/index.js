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
  getSpell: () => {},
  getCurrentState: () => {},
  updateCurrentState: () => {},
});

export const useSpell = () => useContext(Context);

const Spellrovider = ({ children }) => {
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

  const getCurrentState = async () => {
    const currentSpell = await getSpell(settings.currentSpell);
    return currentSpell.gameState;
  };

  const updateCurrentState = async (state) => {
    const currentSpell = await getSpell(settings.currentSpell);
    currentSpell.gameState = state;
    await db.put(currentSpell);
    return currentSpell;
  };

  // Check for existing currentSpell in the db

  const publicInterface = {
    currentSpell,
    setCurrentSpell,
    settings,
    loadSpell,
    getSpell,
    getCurrentState,
    updateCurrentState,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default Spellrovider;
