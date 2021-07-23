import { DataControl } from "../plugins/inspectorPlugin";

export class FewshotControl extends DataControl {
  constructor(data = {}) {
    const options = {
      dataKey: "fewshot",
      name: "Fewshot",
      component: "longText",
      options: {
        editor: true,
        language: data.language || "plaintext",
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}
