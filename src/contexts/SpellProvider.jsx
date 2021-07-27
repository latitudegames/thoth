import { useContext, createContext, useState, useRef } from "react";
import { useSnackbar } from "notistack";

import { useDB } from "./DatabaseProvider";

const Context = createContext({
  currentSpell: {},
  updateCurrentSpell: {},
  loadSpell: () => {},
  saveSpell: () => {},
  newSpell: () => {},
  saveCurrentSpell: () => {},
  stateHistory: [],
  currentGameState: {},
  getCurrentGameState: () => {},
  rewriteCurrentGameState: () => {},
  updateCurrentGameState: () => {},
  getThothVersion: () => {},
});

export const useSpell = () => useContext(Context);

const SpellProvider = ({ children }) => {
  const {
    db,
    models: { spells },
  } = useDB();
  const { enqueueSnackbar } = useSnackbar();

  const spellRef = useRef;

  const [currentSpell, setCurrentSpell] = useState({});
  const [stateHistory, setStateHistory] = useState([]);

  const updateCurrentSpell = (activeTab) => {
    spellRef.current = activeTab;
    setCurrentSpell(activeTab);
  };

  const loadSpell = async (spellId) => {
    const spellDoc = await spells.getSpell(spellId);

    if (!spellDoc) return;

    const spell = spellDoc.toJSON();
    updateCurrentSpell(spell);
  };

  const getThothVersion = () => {
    //wherever we would like to store this...
    return "Latitude Thoth 0.0.1";
  };

  const saveSpell = async (spellId, update, snack = true) => {
    const spell = await spells.getSpell(spellId);

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

  const newSpell = async ({ graph, name, gameState = {} }) => {
    const newSpell = {
      name,
      graph,
      gameState,
    };

    return db.spells.insert(newSpell);
  };

  const saveCurrentSpell = async (update) => {
    return saveSpell(spellRef.current.name, update);
  };

  const getCurrentGameState = async () => {
    const spellDoc = await spells.getSpell(spellRef.current.name);
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
    const updatedSpell = await spells.getSpell(spellRef.current.name);
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
    getThothVersion,
    loadSpell,
    newSpell,
    rewriteCurrentGameState,
    saveCurrentSpell,
    saveSpell,
    setCurrentSpell,
    stateHistory,
    updateCurrentGameState,
    ...spells,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default SpellProvider;
