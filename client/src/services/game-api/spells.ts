import { initDB } from '../../database'

const _spells = async () => {
  const db = await initDB()
  const { spells } = db.modules
  return spells
}

export const saveSpell = async args => {
  const spells = await _spells()

  return { data: 'testing' }
}

export const loadSpell = async args => {
  const spells = await _spells()

  return { data: 'testing' }
}

export const getSpell = async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
  const spells = await _spells()

  return { data: 'testing' }
}

export const getSpells = async args => {
  const spells = await _spells()

  return { data: 'testing' }
}
