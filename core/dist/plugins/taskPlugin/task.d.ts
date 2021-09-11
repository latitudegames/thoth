import { NodeData } from "rete/types/core/data";
import { Component } from "rete/types";
declare type TaskRef = {
    key: string;
    task: Task;
    run?: Function;
    next?: any[];
};
declare type TaskOptions = {
    outputs: object;
    init: Function;
    onRun: Function;
};
declare type RunOptions = {
    propagate?: boolean;
    needReset?: boolean;
    garbage?: Task[];
    fromSocket?: string;
};
interface IComponentWithTask extends Component {
    task: TaskOptions;
    _task: Task;
}
export declare class Task {
    node: NodeData;
    inputs: object;
    component: IComponentWithTask;
    worker: Function;
    next: TaskRef[];
    outputData: object | null;
    closed: string[];
    constructor(inputs: object, component: IComponentWithTask, node: NodeData, worker: Function);
    getInputs(type: any): string[];
    getInputFromConnection(socketKey: any): any;
    reset(): void;
    run(data?: unknown, options?: RunOptions): Promise<void>;
    clone(root: boolean | undefined, oldTask: any, newTask: any): Task;
}
export {};
