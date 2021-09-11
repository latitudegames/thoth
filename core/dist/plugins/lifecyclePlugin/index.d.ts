import { NodeEditor } from 'rete';
declare function install(editor: NodeEditor): void;
export * from './interfaces';
declare const plugin: {
    name: string;
    install: typeof install;
};
export default plugin;
