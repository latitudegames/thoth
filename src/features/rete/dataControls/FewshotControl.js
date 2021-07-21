import { DataControl } from "../plugins/inspectorPlugin";

export class FewshotControl extends DataControl {
  constructor(data = {}) {
    const options = {
      dataKey: "fewshot",
      name: "Fewshot",
      controls: {
        component: "longText",
        editor: true,
        data: {
          language: data.language || "plaintext",
        },
      },
    };

    super(options);
  }

  onData(data) {
    return;
  }
}
