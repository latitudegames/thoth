import { ModuleSocketType } from "./module-manager";
export declare function extractNodes(nodes: any, map: any): any[];
export declare function addIO(node: any, inputs: ModuleSocketType[], outputs: ModuleSocketType[], triggerOuts: ModuleSocketType[], triggerIns: ModuleSocketType[]): void;
export declare function removeIO(node: any, editor: any, inputs: ModuleSocketType[], outputs: ModuleSocketType[]): void;
