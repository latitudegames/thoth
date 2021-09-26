import Rete from 'rete'

// TODO fix this very unmaintainable mapping
// this is a horrible hack and only temprorary tunil we have a rete schema migration system set up
// with the goal of changing the name of every socket to match the name of the variable.
// Used in the module manager utils addIO function

export type SocketNameType =
  | 'Any type'
  | 'Number'
  | 'Boolean'
  | 'Array'
  | 'String'
  | 'Object'
  | 'Trigger'

export type SocketType =
  | 'anySocket'
  | 'numSocket'
  | 'booleanSocket'
  | 'arraySocket'
  | 'stringSocket'
  | 'objectSocket'
  | 'triggerSocket'

export const socketNameMap: Record<SocketNameType, SocketType> = {
  'Any type': 'anySocket',
  Number: 'numSocket',
  Boolean: 'booleanSocket',
  Array: 'arraySocket',
  String: 'stringSocket',
  Object: 'objectSocket',
  Trigger: 'triggerSocket',
}

export const anySocket = new Rete.Socket('Any type')

export const numSocket = new Rete.Socket('Number')
export const booleanSocket = new Rete.Socket('Boolean')
export const arraySocket = new Rete.Socket('Array')
export const stringSocket = new Rete.Socket('String')
export const objectSocket = new Rete.Socket('Object')
export const triggerSocket = new Rete.Socket('Trigger')

const sockets = [
  numSocket,
  booleanSocket,
  stringSocket,
  arraySocket,
  objectSocket,
]

sockets.forEach(socket => {
  anySocket.combineWith(socket)
  socket.combineWith(anySocket)
})
