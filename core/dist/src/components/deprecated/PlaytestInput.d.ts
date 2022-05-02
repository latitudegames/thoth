import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../../types';
import { Task } from '../../plugins/taskPlugin/task';
import { ThothComponent, ThothTask } from '../../thoth-component';
declare type WorkerReturn = {
    text: string;
};
export declare class PlaytestInput extends ThothComponent<WorkerReturn> {
    initialTask?: Task;
    nodeTaskMap: Record<number, ThothTask>;
    constructor();
    subscriptionMap: Record<string, Function>;
    unsubscribe?: () => void;
    subscribeToPlaytest(node: ThothNode): void;
    destroyed(node: ThothNode): void;
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, data }: {
        silent: boolean;
        data: string;
    }): {
        text: string;
    };
}
export {};
