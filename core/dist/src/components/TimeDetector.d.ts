import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    detectedTime: string;
};
export declare class TimeDetectorComponent extends ThothComponent<Promise<WorkerReturn>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<{
        detectedTime: string;
    }>;
}
export {};
