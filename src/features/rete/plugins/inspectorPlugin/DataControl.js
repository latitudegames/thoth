export class DataControl {
  inspector = null;
  editor = null;
  node = null;
  component = null;

  constructor({ dataKey, name, component, data, options, ...rest }) {
    this.dataKey = dataKey;
    this.name = name;
    this.componentData = data;
    this.componentKey = component;
    this.options = options;
    this.onData = rest.onData || this.onData;
  }

  //Serializer to easily extract the data controls information for publishing
  get control() {
    return {
      dataKey: this.dataKey,
      name: this.name,
      component: this.componentKey,
      data: this.componentData,
      option: this.options,
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
