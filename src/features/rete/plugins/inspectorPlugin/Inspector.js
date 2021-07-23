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

    const existingSockets = [];
    this.node[control.dataKey].forEach((out) => {
      existingSockets.push(out.key);
    });

    // get array of ignored socket names
    const ignored = control.data.ignored || [];
    // this?.control?.data?.ignored.map((socket) => socket.socketKey) || [];

    // Any outputs existing on the current node that arent incoming have been deleted
    // and need to be removed.
    existingSockets
      .filter(
        (existing) =>
          !sockets.some((incoming) => incoming.socketKey === existing)
      )
      .filter((existing) => ignored.some((socket) => socket !== existing))
      .forEach((key) => {
        const socket = this.node[control.dataKey].get(key);

        this.node
          .getConnections()
          .filter((con) => con[control.connectionType].key === key)
          .forEach((con) => {
            this.editor.removeConnection(con);
          });

        if (this.connectionType === "output") {
          this.node.removeOutput(socket);
        } else {
          this.node.removeInput(socket);
        }
      });

    // any incoming outputs not already on the node are new and will be added.
    const newSockets = sockets.filter(
      (socket) => !existingSockets.includes(socket)
    );

    // Here we are running over and ensuring that the outputs are in the task
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

    // From these new outputs, we iterate and add an output socket to the node
    newSockets.forEach((socket) => {
      const SocketConstructor =
        this.connectionType === "output" ? Rete.Output : Rete.Input;
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

    // Send the right databack to each individual control callback handle

    for (let [key, control] of this.dataControls) {
      const isEqual = deepEqual(this.cache[key], data[key]);

      if (isEqual) continue;

      if (data.inputs) {
        this.handleSockets(data["inputs"], control.control);
        continue;
      }

      if (data.inputs) {
        this.handleSockets(data["outputs"], control.control);
        continue;
      }

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
