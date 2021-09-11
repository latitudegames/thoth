import { NodeData } from "rete/types/core/data";
import { Socket as SocketType } from "rete/types";
import { Engine, Socket } from "rete";
import { Module } from "./module";
import { ModuleType } from "../../types";
export declare type ModuleSocketType = {
    name: string;
    socketKey: string;
    socket: SocketType;
};
export declare class ModuleManager {
    engine?: Engine | null;
    modules: ModuleType[];
    inputs: Map<string, SocketType>;
    outputs: Map<string, SocketType>;
    triggerIns: Map<string, SocketType>;
    triggerOuts: Map<string, SocketType>;
    constructor(modules: any);
    addModule(module: ModuleType): void;
    setModules(modules: ModuleType[]): void;
    updateModule(module: ModuleType): void;
    getSockets(data: any, typeMap: any, defaultName: string): ModuleSocketType[];
    getInputs(data: any): ModuleSocketType[];
    getOutputs(data: any): ModuleSocketType[];
    getTriggerOuts(data: any): ModuleSocketType[];
    getTriggerIns(data: any): ModuleSocketType[];
    socketFactory(node: NodeData, socket: Socket | Function | undefined): SocketType;
    registerInput(name: any, socket: any): void;
    registerTriggerIn(name: any, socket: any): void;
    registerTriggerOut(name: any, socket: any): void;
    registerOutput(name: any, socket: any): void;
    getTriggeredNode(data: any, socketKey: any): any;
    workerModule(node: any, inputs: any, outputs: any, args: any): Promise<Module | undefined>;
    workerInputs(node: any, inputs: any, outputs: any, { module }: {
        module: Module;
    }): any;
    workerOutputs(node: any, inputs: any, outputs: any, { module }: {
        module: Module;
    }): void;
    workerTriggerIns(node: any, inputs: any, outputs: any, { module, ...rest }: {
        module: Module;
    }): void;
    workerTriggerOuts(node: any, inputs: any, outputs: any, { module, ...rest }: {
        module: Module;
    }): void;
    setEngine(engine: any): void;
}
