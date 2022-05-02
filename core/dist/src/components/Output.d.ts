import { EditorContext, NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { ThothComponent } from '../thoth-component';
export declare class Output extends ThothComponent<void> {
    constructor();
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, thoth }: {
        silent: boolean;
        thoth: EditorContext;
    }): {
        text: string;
    };
}
