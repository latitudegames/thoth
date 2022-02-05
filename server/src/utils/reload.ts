import { database } from '@latitudegames/thoth-core/src/superreality/database'

export async function reloadConfigs() {
  await database.instance.readConfig()
}

export async function reloadProfanity() {
  await database.instance._initProfanityFilter()
}

export async function reloadAgentInstances() {}
