import { NodeData, ThothNode, ThothWorkerInputs } from '../../types';
import { ThothComponent } from '../thoth-component';
export declare class StringProcessor extends ThothComponent<Record<string, string>> {
    constructor();
    node: {};
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs): {};
}
