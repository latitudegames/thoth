import { EngineContext, NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    actionType: string;
};
export declare class ActionTypeComponent extends ThothComponent<Promise<WorkerReturn>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<{
        actionType: string;
    }>;
}
export {};
