export default plugin;
declare namespace plugin {
    export const name: string;
    export { install };
    export { zoomAt };
}
declare function install(editor: any, params: any): void;
declare class install {
    constructor(editor: any, params: any);
    _background: Background | undefined;
    _restrictor: Restrictor | undefined;
    _snap: SnapGrid | undefined;
}
import { zoomAt } from "./zoom-at";
import { Background } from "./background";
import { Restrictor } from "./restrictor";
import { SnapGrid } from "./snap";
