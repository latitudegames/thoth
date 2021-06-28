import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useDB } from "react-pouchdb";

import defaultSpellData from "./defaultSpell";

const Context = createContext({
  settings: {},
  currentSpell: {},
  setCurrentSpell: {},
  loadSpell: () => {},
});

export const useThoth = () => useContext(Context);

const ThothProvider = ({ children }) => {
  const db = useDB();
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
      await db.put(settings);

      const defaultSpell = await db.get("defaultSpell").catch((err) => {
        if (err.name === "not_found") {
          return defaultSpellData;
        }
      });

      console.log("default spell", defaultSpell);

      await db.put(defaultSpell);
      setCurrentSpellState(defaultSpell);
    })();
  }, [db, setCurrentSpell]);

  const loadSpell = async (spellId) => {
    const spell = await db.get(spellId);
    setCurrentSpell(spell);
  };

  // Check for existing currentSpell in the db

  const publicInterface = {
    currentSpell,
    setCurrentSpell,
    settings,
    loadSpell,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ThothProvider;
