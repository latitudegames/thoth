import { NodeData, ThothNode } from '../../types';
import { TaskOptions } from '../plugins/taskPlugin/task';
import { ThothComponent, ThothTask } from '../thoth-component';
export declare class TriggerIn extends ThothComponent<void> {
    task: TaskOptions;
    category: string;
    info: string;
    contextMenuName: string;
    nodeTaskMap: Record<number, ThothTask>;
    constructor();
    subscriptionMap: Record<string, Function>;
    triggerSubscriptionMap: Record<string, Function>;
    unsubscribe?: () => void;
    subscribeToPlaytest(node: ThothNode): void;
    subscribeToTrigger(node: ThothNode): void;
    destroyed(node: ThothNode): void;
    run(node: ThothNode, data: NodeData): Promise<void>;
    builder(node: ThothNode): ThothNode;
    worker(): {};
}
