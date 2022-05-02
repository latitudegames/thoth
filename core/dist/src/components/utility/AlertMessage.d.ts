import { NodeData, ThothNode } from '../../../types';
import { ThothComponent } from '../../thoth-component';
export declare class Alert extends ThothComponent<void> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData): void;
}
