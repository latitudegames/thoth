import { NodeData, ThothNode, ThothWorkerInputs } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    text: string;
};
export declare class JoinListComponent extends ThothComponent<WorkerReturn> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs & {
        list: [string][];
    }): {
        text: string;
    };
}
export {};
