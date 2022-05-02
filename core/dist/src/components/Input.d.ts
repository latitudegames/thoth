import { NodeData, ThothNode, ThothWorkerInputs, ThothWorkerOutputs } from '../../types';
import { ThothComponent, ThothTask } from '../thoth-component';
declare type InputReturn = {
    output: unknown;
};
export declare class InputComponent extends ThothComponent<InputReturn> {
    nodeTaskMap: Record<number, ThothTask>;
    constructor();
    subscriptionMap: Record<string, Function>;
    unsubscribe?: () => void;
    subscribeToPlaytest(node: ThothNode): void;
    destroyed(node: ThothNode): void;
    builder(node: ThothNode): ThothNode;
    worker(node: NodeData, inputs: ThothWorkerInputs, outputs: ThothWorkerOutputs, { silent, data }: {
        silent: boolean;
        data: string | undefined;
    }): {
        output: unknown;
    };
}
export {};
