import { database } from '@latitudegames/thoth-core/src/superreality/database'

const maxMSDiff = 1000

export function initAgentsLoop(update: Function, lateUpdate: Function) {
  const date = new Date()
  let interval = (60 - date.getSeconds()) * 1000

  setTimeout(() => {
    setInterval(() => {
      agentsLoop(
        (id: number) => {
          update(id)
        },
        (id: number) => {
          lateUpdate(id)
        }
      )
    }, 100 / 6)
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
