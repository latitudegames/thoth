export class SnapGrid {
    constructor(editor: any, { size, dynamic }: {
        size?: number | undefined;
        dynamic?: boolean | undefined;
    });
    editor: any;
    size: number;
    onTranslate(data: any): void;
    onDrag(node: any): void;
    snap(value: any): number;
}
