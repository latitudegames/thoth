export default class History {
    active: boolean;
    produced: any[];
    reserved: any[];
    add(action: any): void;
    get last(): any;
    _do(from: any, to: any, type: any): void;
    undo(): void;
    clear(): void;
    redo(): void;
}
