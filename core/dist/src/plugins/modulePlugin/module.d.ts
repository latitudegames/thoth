export declare class Module {
    inputs: Record<string, unknown>;
    outputs: Record<string, unknown>;
    constructor();
    read(inputs: Record<string, unknown[]>): void;
    write(outputs: Record<string, any>): void;
    getInput(key: string): unknown;
    setOutput(key: string, value: unknown): void;
}
