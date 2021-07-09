export class DataControl {
  inspector = null;
  editor = null;

  constructor({ data, name, controls, ...rest }) {
    this.key = data;
    this.name = name;
    this.controls = controls;
    this.onData = rest.onData || this.onData;
  }

  //Serializer to esail extract the data controls information for publishing
  data() {
    return {
      key: this.key,
      name: this.name,
      controls: this.controls,
    };
  }

  // stub function
  async onData(data) {
    return;
  }
}
