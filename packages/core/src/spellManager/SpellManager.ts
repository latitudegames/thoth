import io from 'socket.io'
import SpellRunner from './SpellRunner'

export default class SpellManager {
  spellRunnerMap: Map<number, SpellRunner> = new Map()
  socket: io.Socket

  constructor(socket: io.Socket) {
    this.socket = socket

  getSpellRunner(spellId: string) {
    return this.spellRunnerMap.get(spellId)
  }

  }
}
