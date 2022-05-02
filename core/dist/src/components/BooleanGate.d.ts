import { NodeData, ThothNode, ThothWorkerInputs } from '../../types';
import { ThothComponent } from '../thoth-component';
export declare class BooleanGate extends ThothComponent<void> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs): void;
}
