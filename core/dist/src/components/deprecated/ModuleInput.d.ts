import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../../types';
import { TaskOptions } from '../../plugins/taskPlugin/task';
import { ThothComponent } from '../../thoth-component';
export declare class ModuleInput extends ThothComponent<Record<string, unknown>> {
    task: TaskOptions;
    category: string;
    info: string;
    contextMenuName: string;
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs): ThothWorkerOutputs;
}
