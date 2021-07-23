import { DataControl } from "../plugins/inspectorPlugin";
export class CodeControl extends DataControl {
  constructor({ dataKey, name }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: "code",
      options: {
        editor: true,
        language: "javascript",
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}
