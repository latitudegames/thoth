import { DataControl } from "../DataControl";

export class InfoControl extends DataControl {
  constructor({ dataKey, name, info }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: "info",
      data: {
        info,
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}
