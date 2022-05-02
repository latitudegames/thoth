import { Socket } from 'rete';
import { IRunContextEditor } from '.';
import { ChainData, ThothNode } from '../../../types';
import { ModuleSocketType } from './module-manager';
export declare type ThroughPutType = 'outputs' | 'inputs';
export declare function extractNodes(nodes: ChainData['nodes'], map: Map<string, Socket>): import("rete/types/core/data").NodeData[];
declare type AddIO = {
    node: ThothNode;
    inputs: ModuleSocketType[];
    outputs: ModuleSocketType[];
    triggerOuts: ModuleSocketType[];
    triggerIns: ModuleSocketType[];
    useSocketName: boolean;
};
export declare function addIO({ node, inputs, outputs, triggerOuts, triggerIns, useSocketName, }: AddIO): void;
export declare function removeIO(node: ThothNode, editor: IRunContextEditor, inputs: ModuleSocketType[], outputs: ModuleSocketType[]): void;
export {};
