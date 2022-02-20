import { database } from '@latitudegames/thoth-core/src/connectors/database'

const maxMSDiff = 5000
let interval = 3000

export function initAgentsLoop(update: Function, lateUpdate: Function) {
  const date = new Date()
  setInterval(() => {
    agentsLoop(
      (id: number) => {
        update(id)
      },
      (id: number) => {
        lateUpdate(id)
      }
    )
  }, interval)
}

export async function agentsLoop(update: Function, lateUpdate: Function) {
  const agents = await database.instance.getLastUpdatedInstances()
  const now = new Date()
  const updated = []

  for (let i = 0; i < agents.length; i++) {
    const id = agents[i].id
    const lastUpdate = new Date(agents[i].lastUpdated ?? 0)
    if (now.valueOf() - lastUpdate.valueOf() > maxMSDiff) {
      update(id)

      updated.push(id)
      database.instance.setInstanceUpdated(id)
    }
  }
  for (let i = 0; i < updated.length; i++) {
    lateUpdate(updated[i])
  }
}
