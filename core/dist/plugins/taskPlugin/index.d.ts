declare function install(editor: any): void;
export { Task } from "./task";
declare const defaultExport: {
    name: string;
    install: typeof install;
};
export default defaultExport;
