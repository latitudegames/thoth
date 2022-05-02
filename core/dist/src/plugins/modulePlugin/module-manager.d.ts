import { Engine, Socket } from 'rete';
import { Socket as SocketType } from 'rete/types';
import { ChainData, ModuleType, ModuleWorkerOutput, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../../types';
import { SocketNameType } from '../../sockets';
import { Module } from './module';
import { NodeData } from 'rete/types/core/data';
export declare type ModuleSocketType = {
    name: SocketNameType;
    socketKey: string;
    socket: SocketType;
    [key: string]: unknown;
};
export declare type ModuleGraphData = {
    nodes: Record<string, ThothNode>;
};
export declare class ModuleManager {
    engine?: Engine | null;
    modules: Record<string, ModuleType>;
    inputs: Map<string, Socket>;
    outputs: Map<string, Socket>;
    triggerIns: Map<string, Socket>;
    triggerOuts: Map<string, Socket>;
    constructor(modules: Record<string, ModuleType>);
    addModule(module: ModuleType): void;
    setModules(modules: Record<string, ModuleType>): void;
    updateModule(module: ModuleType): void;
    deleteModule(module: ModuleType): void;
    getSockets(data: ChainData, typeMap: Map<string, Socket>, defaultName: string): ModuleSocketType[];
    getInputs(data: ChainData): ModuleSocketType[];
    getOutputs(data: ChainData): ModuleSocketType[];
    getTriggerOuts(data: ChainData): ModuleSocketType[];
    getTriggerIns(data: ChainData): ModuleSocketType[];
    socketFactory(node: NodeData, socket: Socket | Function | undefined): SocketType;
    registerInput(name: string, socket: Socket): void;
    registerTriggerIn(name: string, socket: Socket): void;
    registerTriggerOut(name: string, socket: Socket): void;
    registerOutput(name: string, socket: Socket): void;
    getTriggeredNode(data: ChainData, socketKey: string): NodeData | undefined;
    workerModule(node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, args: {
        socketInfo: {
            target: string;
        };
    }): Promise<Module | undefined>;
    workerInputs(node: ThothNode, inputs: ThothWorkerInputs, outputs: ModuleWorkerOutput, { module }: {
        module: Module;
    }): ModuleWorkerOutput | undefined;
    workerOutputs(node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { module }: {
        module: Module;
    }): void;
    workerTriggerIns(node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { module }: {
        module: Module;
    }): void;
    workerTriggerOuts(node: ThothNode, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { module }: {
        module: Module;
    }): void;
    setEngine(engine: Engine): void;
}
