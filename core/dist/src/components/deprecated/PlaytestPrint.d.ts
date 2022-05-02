import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../../types';
import { ThothComponent } from '../../thoth-component';
export declare class PlaytestPrint extends ThothComponent<void> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent }: {
        silent: boolean;
    }): {};
}
