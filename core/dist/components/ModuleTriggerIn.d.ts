import Rete from "rete";
export declare class ModuleTriggerIn extends Rete.Component {
    task: object;
    module: object;
    category: string;
    info: string;
    workspaceType: "module" | "spell";
    contextMenuName: string;
    nodeTaskMap: {};
    constructor();
    run(node: any, data: any): Promise<void>;
    builder(node: any): any;
    worker(node: any, inputs: any, outputs: any): Promise<{}>;
}
