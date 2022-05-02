import { NodeData } from '../../types';
export declare const createNameFromSocket: (type: 'inputs' | 'outputs') => (node: NodeData, socketKey: string) => string | undefined;
export declare const createSocketFromName: (type: 'inputs' | 'outputs') => (node: NodeData, name: string) => string | undefined;
export declare const inputNameFromSocketKey: (node: NodeData, socketKey: string) => string | undefined;
export declare const outputNameFromSocketKey: (node: NodeData, socketKey: string) => string | undefined;
export declare const socketKeyFromInputName: (node: NodeData, name: string) => string | undefined;
export declare const socketKeyFromOutputName: (node: NodeData, name: string) => string | undefined;
