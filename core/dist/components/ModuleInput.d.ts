import Rete from "rete";
export declare class ModuleInput extends Rete.Component {
    task: object;
    module: object;
    category: string;
    info: string;
    workspaceType: "module" | "spell";
    contextMenuName: string;
    constructor();
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any): any;
}
