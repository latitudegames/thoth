import Rete from "rete";
import deepEqual from "deep-equal";
import { v4 as uuidv4 } from "uuid";
import * as socketMap from "../../sockets";
export class Inspector {
  // Stub of function.  Can be a nodes catch all onData
  onData = () => {};
  cache = {};

  constructor({ component, editor, node }) {
    this.component = component;
    this.editor = editor;
    this.dataControls = new Map();
    this.node = node;
    this.category = component.category;
  }

  _add(list, control, prop) {
    if (list.has(control.key))
      throw new Error(
        `Item with key '${control.key}' already been added to the inspector`
      );

    if (control[prop] !== null)
      throw new Error("Inspector has already been added to some control");

    // Attach the inspector to the incoming control instance
    control[prop] = this;
    control.editor = this.editor;
    control.node = this.node;
    control.component = this.component;
    control.id = uuidv4();

    list.set(control.dataKey, control);
  }

  add(dataControl) {
    this._add(this.dataControls, dataControl, "inspector");
    dataControl.onAdd();
    return this;
  }

  handleSockets(sockets, control) {
    // we assume all sockets are of the same type here
    // and that the data key is set to 'inputs' or 'outputs'

    this.node.data[control.dataKey] = sockets;

    // get all sockets currently on the node
    const existingSockets = [];
    this.node[control.dataKey].forEach((out) => {
      existingSockets.push(out.key);
    });

    const ignored = control.data.ignored || [];

    // outputs that are on the node but not in the incoming sockets is removed
    existingSockets
      .filter(
        (existing) =>
          !sockets.some((incoming) => incoming.socketKey === existing)
      )
      // filter out any sockets which we have set to be ignored
      .filter((existing) => ignored.some((socket) => socket !== existing))
      // iterate over each socket after this to remove is
      .forEach((key) => {
        const socket = this.node[control.dataKey].get(key);

        // we get the connections for the node and remove that connection
        this.node
          .getConnections()
          .filter((con) => con[control.connectionType].key === key)
          .forEach((con) => {
            this.editor.removeConnection(con);
          });

        // handle removing the socket, either output or input
        if (this.connectionType === "output") {
          this.node.removeOutput(socket);
        } else {
          this.node.removeInput(socket);
        }
      });

    // any incoming outputs not on the node already are new and will be added.
    const newSockets = sockets.filter(
      (socket) => !existingSockets.includes(socket)
    );

    // Here we are running over and ensuring that the outputs are in the tasks outputs
    // We only need to do this with outputs, as inputs don't need to be in the task
    if (control.dataKey === "outputs") {
      this.component.task.outputs = this.node.data.outputs.reduce(
        (acc, out) => {
          acc[out.socketKey] = out.taskType || "output";
          return acc;
        },
        { ...this.component.task.outputs }
      );
    }

    // Iterate over any new sockets and add them
    newSockets.forEach((socket) => {
      // get the right constructor method for the socket
      const SocketConstructor =
        this.connectionType === "output" ? Rete.Output : Rete.Input;

      // use the provided information from the socket to generate it
      const newSocket = new SocketConstructor(
        socket.socketKey || socket.name.toLowerCase(),
        socket.name,
        socketMap[socket.socketType]
      );

      if (this.connectionType === "output") {
        this.node.addOutput(newSocket);
      } else {
        this.node.addInput(newSocket);
      }
    });

    this.node.update();
  }

  handleData(data) {
    this.node.data = {
      ...this.node.data,
      ...data,
    };

    // Send data to a possibel node global handler
    this.onData(data);

    // go over each data control
    for (let [key, control] of this.dataControls) {
      const isEqual = deepEqual(this.cache[key], data[key]);

      // compare agains the cache to see if it has changed
      if (isEqual) continue;

      // if there is inputs in the data, only handle the incoming sockets
      if (data.inputs) {
        this.handleSockets(data["inputs"], control.control);
        continue;
      }

      // if there is outputs in the data, only handle the incoming sockets
      if (data.inputs) {
        this.handleSockets(data["outputs"], control.control);
        continue;
      }

      // only call onData if it exists
      if (!control?.onData) continue;

      control.onData(data[key]);
    }

    this.cache = data;

    // update the node at the end ofthid
    this.node.update();
  }

  get(key) {}

  // returns all data prepared for the pubsub to send it.
  data() {
    const dataControls = Array.from(this.dataControls.entries()).reduce(
      (acc, [key, val]) => {
        // use the data method on controls to get data shape
        acc[key] = val.control;
        return acc;
      },
      {}
    );

    return {
      name: this.node.name,
      nodeId: this.node.id,
      dataControls,
      data: this.node.data,
      category: this.node.category,
    };
  }

  remove(key) {}
}
