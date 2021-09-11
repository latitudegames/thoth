import Rete from "rete";
import { NodeData } from "rete/types/core/data";
import { Task } from "../plugins/taskPlugin/task";
declare class ThothReteNodeEditor extends Rete.NodeEditor {
    pubSub: any;
    thoth: any;
    thothV2: any;
    tab: any;
}
export declare abstract class ThothReteComponent extends Rete.Component {
    editor: ThothReteNodeEditor;
    task: {
        outputs: {
            [key: string]: string;
        };
        init?: (task: Task, node: NodeData) => void;
    };
    category: string;
    info: string;
    display: boolean;
    _task: Task;
}
export {};
