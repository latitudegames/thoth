const loadSpellModel = db => {
  const getSpell = async spellId => {
    return await db.spells
      .findOne({
        selector: {
          name: spellId,
        },
      })
      .exec()
  }

  const getSpells = async spellId => {
    return await db.spells.find().exec()
  }

  const updateSpell = async (spellId, update) => {
    const spell = await getSpell(spellId)

    return spell.atomicUpdate(oldData => {
      return {
        ...oldData,
        ...update,
      }
    })
  }

  const saveSpell = async spellUpdate => {
    const spell = await getSpell(spellUpdate.name)

    return spell.atomicUpdate(oldData => {
      return {
        ...oldData,
        ...spellUpdate,
      }
    })
  }

  const newSpell = async ({ graph, name, gameState = {} }) => {
    const newSpell = {
      name,
      graph,
      gameState,
    }

    return await db.spells.insert(newSpell)
  }

  return {
    getSpell,
    getSpells,
    updateSpell,
    saveSpell,
    newSpell,
  }
}

export default loadSpellModel
