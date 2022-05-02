import { EngineContext, NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../../types';
import { ThothComponent } from '../../thoth-component';
declare type WorkerReturn = {
    output: string;
};
export declare class Echo extends ThothComponent<Promise<WorkerReturn>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<{
        output: string;
    }>;
}
export {};
