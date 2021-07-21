import { DataControl } from "../plugins/inspectorPlugin";

const defaultCode = `
// inputs, outputs, and the node are your arguments
// inputs and outputs are an object map where the keys 
// are your defined inputs and outputs.
function process(node, inputs, data) {

  // Keys of the object returned must match the names 
  // of your outputs you defined.
  return {}
}
`;
export class CodeControl extends DataControl {
  constructor({ dataKey, name }) {
    const options = {
      dataKey: dataKey,
      name: name,
      controls: {
        component: "code",
        data: {
          language: "javascript",
          defaultCode,
          editor: true,
        },
      },
    };

    super(options);
  }

  onAdd() {
    if (!this.node.data.code) this.node.data.code = defaultCode;
  }

  onData(data) {
    return;
  }
}
