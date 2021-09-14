import { Node,NodeEditor } from 'rete';
import { ThothEngineComponent } from './engine';
import { ThothNode } from './types';

export abstract class ThothComponent extends ThothEngineComponent {
// Original Class: https://github.com/latitudegames/rete/blob/master/src/component.ts
    editor: NodeEditor | null = null;
    data: unknown = {};

    constructor(name: string) {
        super(name);
    }

    abstract builder(node: Node): Promise<ThothNode> | ThothNode;

    async build(node: Node) {
        await this.builder(node);

        return node;
    }

    async createNode(data = {}) {
        const node = new Node(this.name);
        
        node.data = data;
        await this.build(node);

        return node;
    }
}