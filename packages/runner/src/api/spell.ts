import { authRequest } from './axios'

export const getSpell = async (spellId: string) => {
  try {
    const response = await authRequest({
      url: `/game/spells/${spellId}`,
    })

    return response.data
  } catch (err) {
    console.log('Error getting spell!')
    console.log('Err', err)
    return {}
  }
}
