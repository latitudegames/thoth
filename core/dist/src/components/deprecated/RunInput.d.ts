import { NodeData, ThothNode } from '../../../types';
import { Task } from '../../plugins/taskPlugin/task';
import { ThothComponent } from '../../thoth-component';
declare type WorkerReturn = {
    text: string;
};
export declare class RunInputComponent extends ThothComponent<WorkerReturn> {
    initialTask?: Task;
    subscriptionMap: any;
    constructor();
    destroyed(node: ThothNode): void;
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData): {
        text: string;
    };
}
export {};
