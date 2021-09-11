import { Engine, NodeEditor } from "rete/types";
import { ModuleManager } from "./module-manager";
interface IRunContextEngine extends Engine {
    moduleManager: ModuleManager;
    on: any;
    trigger: any;
}
interface IRunContextEditor extends NodeEditor {
    moduleManager: ModuleManager;
}
declare function install(runContext: IRunContextEngine | IRunContextEditor, { engine, modules }: any): void;
declare const moduleExport: {
    name: string;
    install: typeof install;
};
export default moduleExport;
