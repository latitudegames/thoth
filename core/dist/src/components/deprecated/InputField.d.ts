import { NodeData, ThothNode } from '../../../types';
import { ThothComponent } from '../../thoth-component';
declare type WorkerReturn = {
    text: string;
};
export declare class InputFieldComponent extends ThothComponent<WorkerReturn> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData): {
        text: string;
    };
}
export {};
