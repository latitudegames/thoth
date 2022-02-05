/* eslint-disable functional/no-class */
/* eslint-disable functional/no-this-expression */
export class Module {
  inputs: Record<string, unknown> = {}
  outputs: Record<string, unknown> = {}
  constructor() {
    this.inputs = {}
    this.outputs = {}
  }

  read(inputs: Record<string, unknown>) {
    this.inputs = inputs
  }

  write(outputs: Record<string, unknown>) {
    console.log("outputs are", outputs);
    console.log("this.outputs is", this.outputs);
    Object.keys(this.outputs).forEach(key => {
      outputs[key] = this.outputs[key]
    })
  }

  getInput(key: string) {
    return this.inputs[key]
  }

  setOutput(key: string, value: unknown) {
    console.log("key, value", key, value)
    this.outputs[key] = value
  }
}
