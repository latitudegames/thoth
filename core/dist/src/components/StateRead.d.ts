import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { EngineContext } from '../../types';
import { ThothComponent } from '../thoth-component';
export declare class StateRead extends ThothComponent<Promise<Record<string, unknown>>> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { thoth }: {
        silent: boolean;
        thoth: EngineContext;
    }): Promise<{
        [key: string]: unknown;
    }>;
}
