import { database } from '@latitudegames/thoth-core/src/connectors/database'

export async function reloadConfigs() {
  await database.instance.readConfig()
}

export async function reloadProfanity() {
  await database.instance._initProfanityFilter()
}

export async function reloadAgentInstances() { }
