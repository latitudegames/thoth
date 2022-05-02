import { NodeData, ThothNode, ThothWorkerInputs } from '../../types';
import { ThothComponent } from '../thoth-component';
export declare class SwitchGate extends ThothComponent<void> {
    constructor();
    node: {};
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs): void;
}
