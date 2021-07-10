import Rete from "rete";

export const anySocket = new Rete.Socket("Any type");
export const numSocket = new Rete.Socket("Number");
export const booleanSocket = new Rete.Socket("Boolean");
export const arraySocket = new Rete.Socket("Aarray");
export const stringSocket = new Rete.Socket("String");
export const dataSocket = new Rete.Socket("Data");

export const actionSocket = new Rete.Socket("Action");
export const actionTypeSocket = new Rete.Socket("ActionType");
export const actionDifficultySocket = new Rete.Socket("Action Difficulty");
export const entitySocket = new Rete.Socket("Entities");
export const timeDetectorSocket = new Rete.Socket("Time Detected");
export const itemTypeSocket = new Rete.Socket("Item Detected");

const sockets = [
  numSocket,
  booleanSocket,
  stringSocket,
  actionSocket,
  actionTypeSocket,
  entitySocket,
  itemTypeSocket,
  timeDetectorSocket,
  actionDifficultySocket,
  arraySocket,
];

sockets.forEach((socket) => {
  anySocket.combineWith(socket);
  socket.combineWith(anySocket);
});
