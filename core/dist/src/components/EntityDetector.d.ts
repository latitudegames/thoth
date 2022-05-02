import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
declare type Entity = {
    name: string;
    type: string;
};
declare type WorkerReturn = {
    entities: Entity[];
};
export declare class EntityDetector extends ThothComponent<Promise<never[] | WorkerReturn>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<never[] | {
        entities: {
            name: string;
            type: string;
        }[];
    }>;
}
export {};
