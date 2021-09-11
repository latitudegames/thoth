export const Action: typeof Act;
export default defaultExport;
import Act from "./action";
declare namespace defaultExport {
    export const name: string;
    export { install };
}
declare function install(editor: any, { keyboard }: {
    keyboard?: boolean | undefined;
}): void;
