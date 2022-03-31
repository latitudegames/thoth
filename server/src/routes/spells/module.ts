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
    console.log("this.inputs were", this.inputs)
    this.inputs = inputs
    console.log("this.inputs are", this.inputs)
  }

  write(outputs: Record<string, unknown>) {
    console.log("outputs were", outputs)
    Object.keys(this.outputs).forEach(key => {
      outputs[key] = this.outputs[key]
    })
    console.log("outputs are now", outputs)
  }

  getInput(key: string) {
    return this.inputs[key]
  }

  setOutput(key: string, value: unknown) {
    this.outputs[key] = value
  }
}
