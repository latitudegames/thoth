import { ThothEditor } from '../../../types';
declare function install(editor: ThothEditor): void;
export { Task } from './task';
declare const defaultExport: {
    name: string;
    install: typeof install;
};
export default defaultExport;
