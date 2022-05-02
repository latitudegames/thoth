import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    result: string;
    composed: string;
};
export declare class Generator extends ThothComponent<Promise<WorkerReturn>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, rawInputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { thoth, silent }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<{
        result: string;
        composed: string;
    }>;
}
export {};
