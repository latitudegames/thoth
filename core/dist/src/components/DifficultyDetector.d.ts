import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type WorkerReturn = {
    difficulty: string | undefined;
    category: string | undefined;
};
export declare class DifficultyDetectorComponent extends ThothComponent<Promise<WorkerReturn>> {
    constructor();
    displayControl: {};
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<{
        difficulty: string | undefined;
        category: string | undefined;
    }>;
}
export {};
