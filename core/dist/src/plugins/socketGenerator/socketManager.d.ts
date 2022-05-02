import { ChainData, DataSocketType, ThothEditor, ThothNode } from '../../../types';
import { ModuleSocketType } from '../modulePlugin/module-manager';
export default class SocketManager {
    node: ThothNode;
    editor: ThothEditor;
    nodeOutputs: DataSocketType[];
    inputs: ModuleSocketType[];
    outputs: ModuleSocketType[];
    triggerOuts: ModuleSocketType[];
    triggerIns: ModuleSocketType[];
    constructor(node: ThothNode, editor: ThothEditor);
    initializeNode(): void;
    updateSocketsFromChain(chain: ChainData): void;
    regenerateSockets(): void;
}
