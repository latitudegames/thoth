import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useDB } from "../Database";
import { useRete } from "../Rete";
import defaultSpellData from "./defaultSpell";

const Context = createContext({
  currentSpell: {},
  currentGameState: {},
  getCurrentGameState: () => {},
  getSpell: () => {},
  loadSpell: () => {},
  rewriteCurrentGameState: () => {},
  saveSpell: () => {},
  saveCurrentSpell: () => {},
  setCurrentSpell: {},
  settings: {},
  stateHistory: [],
  updateCurrentGameState: () => {},
});

export const useThoth = () => useContext(Context);

const ThothProvider = ({ children }) => {
  const { db } = useDB();
  const { editor } = useRete();

  const [currentSpell, setCurrentSpellState] = useState({});
  const [currentGameState, setCurrentGameState] = useState({});
  const [settings, setSettings] = useState({});
  const [stateHistory, setStateHistory] = useState([]);

  const setCurrentSpell = useCallback(
    async (spell) => {
      const settings = await db.settings
        .findOne({
          selector: "default",
        })
        .exec();
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
      let settings = await db.settings
        .findOne({
          selector: { name: "default" },
        })
        .exec();

      if (!settings) {
        settings = await db.settings.inser({
          name: "default",
          currentSpell: "defaultSpell",
        });
      }

      setSettings(settings);

      let defaultSpell = await db.spells
        .findOne({
          selector: {
            name: settings.currentSpell,
          },
        })
        .exec();

      if (!defaultSpell) {
        defaultSpell = await db.spells.insert({
          name: "defaultSpell",
          ...defaultSpellData,
        });
      }

      setCurrentSpellState(defaultSpell);
      setCurrentGameState(defaultSpell.gameState);
    })();
  }, [db, setCurrentSpell]);

  const loadSpell = async (spellId) => {
    const spell = await getSpell(spellId);
    setCurrentSpell(spell);
    setCurrentGameState(spell.gameState);
    editor.loadGraph(spell.graph);
  };

  const getSpell = async (spellId) => {
    return db.spells
      .findOne({
        selector: {
          name: spellId,
        },
      })
      .exec();
  };

  const saveSpell = async (spellId, update) => {
    const spell = await getSpell(spellId);

    return await spell.atomicUpdate((oldData) => {
      return {
        ...oldData,
        ...update,
      };
    });
  };

  const saveCurrentSpell = async (update) => {
    return saveSpell(currentSpell.name, update);
  };

  const getCurrentGameState = async () => {
    const spell = await getSpell(currentSpell.name);
    return spell.gameState;
  };

  const updateCurrentGameState = async (update) => {
    const currentSpell = await getSpell(settings.currentSpell);

    const newState = {
      ...currentSpell.gameState,
      ...update,
    };

    return rewriteCurrentGameState(newState);
  };

  const rewriteCurrentGameState = async (state) => {
    const currentSpell = await getSpell(settings.currentSpell);
    setStateHistory([...stateHistory, currentSpell.gameState]);

    await currentSpell.atomicPatch({
      gameState: state,
    });
    setCurrentSpellState(currentSpell);
    setCurrentGameState(currentSpell.gameState);
    return currentSpell;
  };

  // Check for existing currentSpell in the db
  const publicInterface = {
    currentSpell,
    currentGameState,
    getCurrentGameState,
    getSpell,
    loadSpell,
    rewriteCurrentGameState,
    saveCurrentSpell,
    saveSpell,
    setCurrentSpell,
    settings,
    stateHistory,
    updateCurrentGameState,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ThothProvider;
