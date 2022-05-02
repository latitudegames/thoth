import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    element: string | string[] | unknown;
};
export declare class ForEach extends ThothComponent<Promise<WorkerReturn | undefined>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { element }: {
        element: unknown;
    }): Promise<{
        element: unknown;
    } | undefined>;
}
export {};
