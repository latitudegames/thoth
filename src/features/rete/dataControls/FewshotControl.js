import { DataControl } from "../plugins/inspectorPlugin";

export class FewshotControl extends DataControl {
  constructor(data = {}, icon = "fewshot") {
    const options = {
      dataKey: "fewshot",
      name: "Fewshot",
      component: "longText",
      icon,
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
