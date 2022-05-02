import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
export declare class StateWrite extends ThothComponent<void> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { thoth }: {
        thoth: EngineContext;
    }): Promise<void>;
}
