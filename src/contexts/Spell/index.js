import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";

import { useDB } from "../Database";
import { useRete } from "../Rete";

const Context = createContext({
  currentSpell: {},
  setCurrentSpell: {},
  getSpell: () => {},
  loadSpell: () => {},
  saveSpell: () => {},
  newSpell: () => {},
  saveCurrentSpell: () => {},
  settings: {},
  stateHistory: [],
  currentGameState: {},
  getCurrentGameState: () => {},
  rewriteCurrentGameState: () => {},
  updateCurrentGameState: () => {},
});

export const useSpell = () => useContext(Context);

const SpellProvider = ({ children }) => {
  const { db } = useDB();
  const { editor } = useRete();

  const [currentSpell, setCurrentSpellState] = useState({});
  const [currentGameState, setCurrentGameState] = useState({});
  const [settings, setSettings] = useState({});
  const [stateHistory, setStateHistory] = useState([]);

  const setCurrentSpell = useCallback(
    async (spell) => {
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
        settings = await db.settings.insert({
          name: "default",
          currentSpell: "defaultSpell",
        });
      }

      setSettings(settings);
    })();
  }, [db, setCurrentSpell]);

  const loadSpell = async (spellId) => {
    const result = await getSpell(spellId);
    if (!result) return;

    const spell = result.toJSON();

    setCurrentSpell(spell);
    setCurrentGameState(spell.gameState);

    if (editor?.loadGraph && spell?.graph) {
      editor.loadGraph(spell.graph);
    }
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

  const newSpell = async ({ graph, name }) => {
    const newSpell = {
      name,
      graph,
    };

    return db.spells.insert(newSpell);
  };

  const saveCurrentSpell = async (update) => {
    return saveSpell(currentSpell.name, update);
  };

  const getCurrentGameState = async () => {
    const spell = await getSpell(currentSpell.name);
    return spell.gameState;
  };

  const updateCurrentGameState = async (update) => {
    const newState = {
      ...currentSpell.gameState,
      ...update,
    };

    return rewriteCurrentGameState(newState);
  };

  const rewriteCurrentGameState = async (state) => {
    const updatedSpell = await getSpell(currentSpell.name);
    setStateHistory([...stateHistory, currentSpell.gameState]);

    await updatedSpell.atomicPatch({
      gameState: state,
    });

    const updated = updatedSpell.toJSON();
    setCurrentSpellState(updated);
    setCurrentGameState(updated.gameState);
    return updated;
  };

  // Check for existing currentSpell in the db
  const publicInterface = {
    currentSpell,
    currentGameState,
    getCurrentGameState,
    getSpell,
    loadSpell,
    newSpell,
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

export default SpellProvider;
