import { useContext, createContext, useState, useEffect, useRef } from "react";

import { useDB } from "./Database";
import { usePubSub } from "./PubSub";
import { useRete } from "./Rete";

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
  const { editor } = useRete();
  const { events, subscribe } = usePubSub();

  const spellRef = useRef;

  const [currentSpell, setCurrentSpell] = useState({});
  const [stateHistory, setStateHistory] = useState([]);

  const updateCurrentSpell = (activeTab) => {
    spellRef.current = activeTab;
    setCurrentSpell(activeTab);
  };

  // subscribe to changes in the active tab
  useEffect(() => {
    if (!editor) return;

    db.tabs
      .findOne({ selector: { active: true } })
      .$.subscribe(async (result) => {
        if (!result) return;
        const activeTab = result.toJSON();

        loadSpell(activeTab.spell);
      });
  }, [db, editor]);

  // Listener to save current spell
  // MIght be able to replace this with the use of the spellRef
  useEffect(() => {
    if (!currentSpell) return;
    subscribe(events.SAVE_CURRENT_SPELL, (event, data) => {
      saveCurrentSpell(data);
    });
  }, [events, subscribe, currentSpell]);

  const loadSpell = async (spellId) => {
    const spellDoc = await getSpell(spellId);

    if (!spellDoc) return;

    const spell = spellDoc.toJSON();
    updateCurrentSpell(spell);

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
