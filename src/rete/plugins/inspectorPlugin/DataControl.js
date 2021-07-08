export class DataControl {
  inspector = null;

  constructor({ data, name, controls, onData }) {
    this.key = data;
    this.name = name;
    this.controls = controls;
    this.onData = onData;
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
