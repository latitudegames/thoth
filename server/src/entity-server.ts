import { roomManager } from '@latitudegames/thoth-core/src/components/entities/roomManager'
import { config } from 'dotenv-flow'
import { database } from './database'
import { World } from './entities/World'
config()

async function init() {
  console.log("Starting agent runner")
  new database()
  await database.instance.connect()
  new World()
  new roomManager()
}

init()