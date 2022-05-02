import { NodeData, ThothNode, ThothWorkerInputs } from '../../../types';
import { TaskOptions } from '../../plugins/taskPlugin/task';
import { ThothComponent } from '../../thoth-component';
declare type WorkerReturn = {
    text: string;
};
export declare class ModuleOutput extends ThothComponent<WorkerReturn> {
    task: TaskOptions;
    category: string;
    info: string;
    contextMenuName: string;
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs): {
        text: string;
    };
}
export {};
