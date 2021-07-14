export class DataControl {
  inspector = null;
  editor = null;
  node = null;
  component = null;

  constructor({ dataKey, name, controls, ...rest }) {
    this.dataKey = dataKey;
    this.name = name;
    this.controls = controls;
    this.onData = rest.onData || this.onData;
  }

  //Serializer to esail extract the data controls information for publishing
  data() {
    return {
      dataKey: this.dataKey,
      name: this.name,
      controls: this.controls,
    };
  }

  // stub function
  async onData(data) {
    return;
  }
}
