import { EngineContext, NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { ThothComponent } from '../thoth-component';
export declare class Code extends ThothComponent<unknown> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, data, thoth, }: {
        silent: boolean;
        thoth: EngineContext;
        data: {
            code: unknown;
        };
    }): any;
}
