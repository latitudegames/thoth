import Rete from "rete";
// TODO fix this very unmaintainable mapping
// this is a horrible hack and only temprorary tunil we have a rete schema migration system set up
// with the goal of changing the name of every socket to match the name of the variable.
// Used in the module manager utils addIO function
export var socketNameMap = {
    "Any type": "anySocket",
    Number: "numSocket",
    Boolean: "booleanSocket",
    Array: "arraySocket",
    String: "stringSocket",
    Object: "objectSocket",
    Trigger: "triggerSocket",
};
export var anySocket = new Rete.Socket("Any type");
export var numSocket = new Rete.Socket("Number");
export var booleanSocket = new Rete.Socket("Boolean");
export var arraySocket = new Rete.Socket("Array");
export var stringSocket = new Rete.Socket("String");
export var objectSocket = new Rete.Socket("Object");
export var triggerSocket = new Rete.Socket("Trigger");
var sockets = [
    numSocket,
    booleanSocket,
    stringSocket,
    arraySocket,
    objectSocket,
];
sockets.forEach(function (socket) {
    anySocket.combineWith(socket);
    socket.combineWith(anySocket);
});
