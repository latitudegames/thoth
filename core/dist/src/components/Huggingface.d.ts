import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    result: {
        [key: string]: unknown;
        error?: unknown;
    };
};
export declare class HuggingfaceComponent extends ThothComponent<Promise<WorkerReturn>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, rawInputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<{
        result: {
            [key: string]: unknown;
            error?: unknown;
        };
    }>;
}
export {};
