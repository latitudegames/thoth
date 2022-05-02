import { NodeData } from 'rete/types/core/data';
import { ThothWorkerInputs } from '../../../types';
import { ThothComponent, ThothTask } from '../../thoth-component';
declare type TaskRef = {
    key: string;
    task: ThothTask;
    run?: Function;
    next?: any[];
};
export declare type TaskOptions = {
    outputs: Record<string, unknown>;
    init?: Function;
    onRun?: Function;
    runOneInput?: boolean;
};
declare type RunOptions = {
    propagate?: boolean;
    needReset?: boolean;
    garbage?: Task[];
    fromSocket?: string;
    fromNode?: NodeData;
};
export declare type TaskOutputTypes = 'option' | 'output';
export declare class Task {
    node: NodeData;
    inputs: ThothWorkerInputs;
    component: ThothComponent<unknown>;
    worker: Function;
    next: TaskRef[];
    outputData: Record<string, unknown> | null;
    closed: string[];
    constructor(inputs: ThothWorkerInputs, component: ThothComponent<unknown>, node: NodeData, worker: Function);
    getInputs(type: TaskOutputTypes): string[];
    getInputFromConnection(socketKey: string): any;
    reset(): void;
    run(data?: unknown, options?: RunOptions): Promise<void>;
    clone(root: boolean | undefined, oldTask: ThothTask, newTask: ThothTask): Task;
}
export {};
