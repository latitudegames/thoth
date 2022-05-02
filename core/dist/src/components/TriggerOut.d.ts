import { ThothNode } from '../../types';
import { TaskOptions } from '../plugins/taskPlugin/task';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    trigger: boolean;
};
export declare class TriggerOut extends ThothComponent<WorkerReturn> {
    task: TaskOptions;
    category: string;
    info: string;
    contextMenuName: string;
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(): {
        trigger: boolean;
    };
}
export {};
