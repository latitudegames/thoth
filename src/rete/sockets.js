import Rete from "rete";

export const anySocket = new Rete.Socket("Any type");
export const numSocket = new Rete.Socket("Number");
export const booleanSocket = new Rete.Socket("Boolean");
export const stringSocket = new Rete.Socket("String");
export const actionSocket = new Rete.Socket("Action");
export const actionTypeSocket = new Rete.Socket("ActionType");
export const entitySocket = new Rete.Socket("Entities");
export const dataSocket = new Rete.Socket("Data");
export const itemTypeSocket = new Rete.Socket("Item Detected")

const sockets = [
  numSocket,
  booleanSocket,
  stringSocket,
  actionSocket,
  actionTypeSocket,
  entitySocket,
  itemTypeSocket,
];

sockets.forEach((socket) => {
  anySocket.combineWith(socket);
  socket.combineWith(anySocket);
});
