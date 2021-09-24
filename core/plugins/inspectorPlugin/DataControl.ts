import { Inspector } from "./Inspector";
import { Node, NodeEditor, Component } from "rete";
export type RestProps = {
  onData: () => void
}
export class DataControl {
  inspector: Inspector | null = null;
  editor: NodeEditor | null = null;
  node: Node | null = null;
  component: Component | null = null;
  id: string | null = null;

  dataKey: string;
  name: string;
  componentData: object;
  componentKey: string;
  options: object;
  icon: string;
  write: boolean;

  constructor({
    dataKey,
    name,
    component,
    data = {},
    options = {},
    write = true,
    icon = "ankh",
    ...rest
  }: {
    dataKey: string,
    name: string,
    component: string
    data?: Record<string, unknown>,
    options?: Record<string, unknown>,
    write?: boolean,
    icon?: string,
    onData?: (moduleName:string) => Promise<void>
  }) {
    if (!dataKey) throw new Error(`Data key is required`);
    if (!name) throw new Error(`Name is required`);
    if (!component) throw new Error(`Component name is required`);

    this.dataKey = dataKey;
    this.name = name;
    this.componentData = data;
    this.componentKey = component;
    this.options = options;
    this.onData = rest.onData || this.onData;
    this.icon = icon;
    this.write = write;
  }

  //Serializer to easily extract the data controls information for publishing
  get control() {
    return {
      dataKey: this.dataKey,
      name: this.name,
      component: this.componentKey,
      data: this.componentData,
      options: this.options,
      id: this.id,
      icon: this.icon,
    };
  }

  async onAdd() {
    return;
  }

  // stub function
  async onData(moduleName: string) {
    return;
  }
}
