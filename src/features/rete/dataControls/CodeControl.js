import { DataControl } from "../plugins/inspectorPlugin";

export class CodeControl extends DataControl {
  constructor({ dataKey, name }) {
    const options = {
      dataKey: dataKey,
      name: name,
      controls: {
        component: "code",
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}
