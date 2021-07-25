export class DataControl {
  inspector = null;
  editor = null;
  node = null;
  component = null;

  constructor({
    dataKey,
    name,
    component,
    data = {},
    options = {},
    icon = "ankh",
    ...rest
  }) {
    if (!dataKey) throw new Error(`Data key is required`);
    if (!name) throw new Error(`Name is required`);
    if (!component) throw new Error(`Component name is required`);

    this.dataKey = dataKey;
    this.name = name;
    this.componentData = data;
    this.componentKey = component;
    this.options = options;
    this.onData = rest.onData || this.onData;
    this.icon = icon;
  }

  //Serializer to easily extract the data controls information for publishing
  get control() {
    return {
      dataKey: this.dataKey,
      name: this.name,
      component: this.componentKey,
      data: this.componentData,
      options: this.options,
      id: this.id,
      icon: this.icon,
    };
  }

  async onAdd(data) {
    return;
  }

  // stub function
  async onData(data) {
    return;
  }
}
