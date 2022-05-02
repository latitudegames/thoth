import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    action: string;
};
export declare class TenseTransformer extends ThothComponent<Promise<WorkerReturn>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<{
        action: string;
    }>;
}
export {};
