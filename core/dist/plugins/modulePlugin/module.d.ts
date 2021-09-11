export declare class Module {
    inputs: object;
    outputs: object;
    constructor();
    read(inputs: any): void;
    write(outputs: any): void;
    getInput(key: any): any;
    setOutput(key: any, value: any): void;
}
