const loadSpellModel = (db) => {
  const getSpell = async (spellId) => {
    return db.spells
      .findOne({
        selector: {
          name: spellId,
        },
      })
      .exec();
  }

  const updateSpell = async (spellId, update) => {
    const spell = await getSpell(spellId);

    return spell.atomicUpdate((oldData) => {
      return {
        ...oldData,
        ...update,
      };
    });
  }

  const newSpell = async ({ graph, name, gameState = {} }) => {
    const newSpell = {
      name,
      graph,
      gameState,
    };

    return db.spells.insert(newSpell);
  }

  return {
    getSpell,
    updateSpell,
    newSpell,
  }
}

export default loadSpellModel