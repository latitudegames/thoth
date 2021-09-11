import Rete from "rete";
export declare class ModuleComponent extends Rete.Component {
    module: any;
    _task: any;
    updateModuleSockets: any;
    task: any;
    info: any;
    subscriptionMap: {};
    editor: any;
    noBuildUpdate: boolean;
    category: string;
    constructor();
    builder(node: any): any;
    destroyed(node: any): void;
    unsubscribe(node: any): void;
    subscribe(node: any): Promise<void>;
    updateSockets(node: any, moduleName: any): void;
    worker(node: any, inputs: any, outputs: any, { module }: {
        module: any;
    }): any;
}
