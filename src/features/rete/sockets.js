import Rete from "rete";

export const anySocket = new Rete.Socket("Any type");

export const numSocket = new Rete.Socket("Number");
export const booleanSocket = new Rete.Socket("Boolean");
export const arraySocket = new Rete.Socket("Array");
export const stringSocket = new Rete.Socket("String");
export const objectSocket = new Rete.Socket("Object");
export const dataSocket = new Rete.Socket("Data");

const sockets = [
  numSocket,
  booleanSocket,
  stringSocket,
  arraySocket,
  objectSocket,
];

sockets.forEach((socket) => {
  anySocket.combineWith(socket);
  socket.combineWith(anySocket);
});
