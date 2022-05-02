import { IRunContextEditor } from '../../../types';
declare function install(editor: IRunContextEditor): void;
declare const defaultExport: {
    name: string;
    install: typeof install;
};
export default defaultExport;
