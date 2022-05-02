import { EngineContext, ModuleWorkerOutput, NodeData, Spell, ThothNode, ThothWorkerInputs } from '../../types';
import { ThothEditor } from '../editor';
import { Task } from '../plugins/taskPlugin/task';
import { ThothComponent } from '../thoth-component';
export declare class SpellComponent extends ThothComponent<Promise<ModuleWorkerOutput>> {
    _task: Task;
    updateModuleSockets: Function;
    task: {
        outputs: {};
        closed: {
            [key: string]: string;
        }[];
    };
    info: string;
    subscriptionMap: Record<number, Function>;
    editor: ThothEditor;
    noBuildUpdate: boolean;
    dev: boolean;
    constructor();
    subscribe(node: ThothNode, spellId: string): void;
    builder(node: ThothNode): ThothNode;
    updateSockets(node: ThothNode, spell: Spell): void;
    formatOutputs(node: NodeData, outputs: Record<string, any>): Record<string, any>;
    formatInputs(node: NodeData, inputs: Record<string, any>): Record<string, any>;
    worker(node: NodeData, inputs: ThothWorkerInputs, _outputs: {
        [key: string]: string;
    }, { module, thoth, silent, }: {
        module: {
            outputs: ModuleWorkerOutput[];
        };
        thoth: EngineContext;
        silent: Boolean;
    }): Promise<Record<string, any>>;
}
