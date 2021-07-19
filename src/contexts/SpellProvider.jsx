import { useContext, createContext, useState, useRef } from "react";
import { useSnackbar } from "notistack";

import { useDB } from "./DatabaseProvider";

const Context = createContext({
  currentSpell: {},
  updateCurrentSpell: {},
  getSpell: () => {},
  loadSpell: () => {},
  saveSpell: () => {},
  newSpell: () => {},
  saveCurrentSpell: () => {},
  stateHistory: [],
  currentGameState: {},
  getCurrentGameState: () => {},
  rewriteCurrentGameState: () => {},
  updateCurrentGameState: () => {},
});

export const useSpell = () => useContext(Context);

const SpellProvider = ({ children }) => {
  const { db } = useDB();
  const { enqueueSnackbar } = useSnackbar();

  const spellRef = useRef;

  const [currentSpell, setCurrentSpell] = useState({});
  const [stateHistory, setStateHistory] = useState([]);

  const updateCurrentSpell = (activeTab) => {
    spellRef.current = activeTab;
    setCurrentSpell(activeTab);
  };

  const loadSpell = async (spellId) => {
    const spellDoc = await getSpell(spellId);

    if (!spellDoc) return;

    const spell = spellDoc.toJSON();
    updateCurrentSpell(spell);
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

  const saveSpell = async (spellId, update, snack = true) => {
    const spell = await getSpell(spellId);

    try {
      await spell.atomicUpdate((oldData) => {
        return {
          ...oldData,
          ...update,
        };
      });
      if (snack) enqueueSnackbar("Spell saved");
    } catch (err) {
      if (snack) enqueueSnackbar("Error saving spell");
    }
  };

  const newSpell = async ({ graph, name }) => {
    const newSpell = {
      name,
      graph,
    };

    return db.spells.insert(newSpell);
  };

  const saveCurrentSpell = async (update) => {
    return saveSpell(spellRef.current.name, update);
  };

  const getCurrentGameState = async () => {
    const spellDoc = await getSpell(spellRef.current.name);
    const spell = spellDoc.toJSON();
    return spell.gameState;
  };

  const updateCurrentGameState = async (update) => {
    const newState = {
      ...spellRef.current.gameState,
      ...update,
    };

    return rewriteCurrentGameState(newState);
  };

  const rewriteCurrentGameState = async (state) => {
    const updatedSpell = await getSpell(spellRef.current.name);
    setStateHistory([...stateHistory, updatedSpell.gameState]);

    await updatedSpell.atomicPatch({
      gameState: state,
    });

    const updated = updatedSpell.toJSON();
    updateCurrentSpell(updated);
  };

  // Check for existing currentSpell in the db
  const publicInterface = {
    currentSpell,
    getCurrentGameState,
    getSpell,
    loadSpell,
    newSpell,
    rewriteCurrentGameState,
    saveCurrentSpell,
    saveSpell,
    setCurrentSpell,
    stateHistory,
    updateCurrentGameState,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default SpellProvider;
