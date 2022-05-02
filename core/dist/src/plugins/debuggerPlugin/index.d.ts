import { IRunContextEditor } from '../../../types';
declare function install(editor: IRunContextEditor, { server, throwError }: {
    server?: boolean;
    throwError?: Function;
}): void;
declare const defaultExport: {
    name: string;
    install: typeof install;
};
export default defaultExport;
