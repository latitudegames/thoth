import { Node, NodeEditor } from 'rete';
import { ThothEngineComponent } from './engine';
import { NodeData } from "rete/types/core/data";
import { Task } from "./plugins/taskPlugin/task";
import { ThothNode } from './types';

// Note: We do this so Typescript knows what extra properties we're
// adding to the NodeEditor (in rete/editor.js). In an ideal world, we
// would be extending the class there, when we instantiate it.
class ThothReteNodeEditor extends NodeEditor {
    pubSub;
    thoth;
    thothV2;
    tab;
  }

export type ThothTask = {
    outputs: { [key: string]: string };
    init?: (task: Task, node: NodeData) => void;
  };

export abstract class ThothComponent extends ThothEngineComponent {
// Original Class: https://github.com/latitudegames/rete/blob/master/src/component.ts
    editor: ThothReteNodeEditor | null = null;
    data: unknown = {};
    task: {
        outputs: { [key: string]: string };
        init?: (task: Task, node: NodeData) => void;
      };
      category: string;
      info: string;
      display: boolean;
      _task: Task;
    
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