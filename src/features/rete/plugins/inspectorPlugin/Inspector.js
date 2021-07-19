export class Inspector {
  // Stub of function.  Can be a nodes catch all onData
  onData = () => {};

  constructor({ component, editor, node }) {
    this.component = component;
    this.editor = editor;
    this.dataControls = new Map();
    this.node = node;
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

    list.set(control.dataKey, control);
  }

  add(dataControl) {
    this._add(this.dataControls, dataControl, "inspector");
    return this;
  }

  handleData(data) {
    this.node.data = {
      ...this.node.data,
      ...data,
    };

    // Send data to a possibel node global handler
    this.onData(data);

    // Send the right databack to each individual control callback handle
    this.dataControls.forEach((control, key) => {
      if (control?.onData) control.onData(data[key]);
    });

    // update the node at the end ofthid
    this.node.update();
  }

  get(key) {}

  // returns all data prepared for the pubsub to send it.
  data() {
    const dataControls = Array.from(this.dataControls.entries()).reduce(
      (acc, [key, val]) => {
        // use the data method on controls to get data shape
        acc[key] = val.data();
        return acc;
      },
      {}
    );

    return {
      name: this.node.name,
      nodeId: this.node.id,
      dataControls,
      data: this.node.data,
    };
  }

  remove(key) {}
}
