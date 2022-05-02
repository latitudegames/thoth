import { Engine } from 'rete';
import { ChainData, ModuleType, NodeData, ThothWorkerInputs } from '../types';
import { Task } from './plugins/taskPlugin';
interface WorkerOutputs {
    [key: string]: unknown;
}
export interface ThothEngine extends Engine {
    tasks: Task[];
    activateDebugger?: Function;
    moduleManager?: any;
}
export declare abstract class ThothEngineComponent<WorkerReturnType> {
    name: string;
    data: unknown;
    engine: Engine | null;
    constructor(name: string);
    abstract worker(node: NodeData, inputs: ThothWorkerInputs, outputs: WorkerOutputs, ...args: unknown[]): WorkerReturnType;
}
export declare type InitEngineArguments = {
    name: string;
    components: any[];
    server: boolean;
    modules?: Record<string, ModuleType>;
    throwError?: Function;
};
export declare const initSharedEngine: ({ name, components, server, modules, throwError, }: InitEngineArguments) => ThothEngine;
export declare const extractNodes: (nodes: ChainData['nodes'], map: Set<unknown>) => import("rete/types/core/data").NodeData[];
export declare const getTriggeredNode: (data: ChainData, socketKey: string, map: Set<unknown>) => import("rete/types/core/data").NodeData | undefined;
export {};
