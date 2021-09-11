export class TextInputControl extends Control {
    constructor({ emitter, key, value }: {
        emitter: any;
        key: any;
        value: any;
    });
    render: string;
    component: (props: any) => JSX.Element;
    props: {
        emitter: any;
        name: any;
        value: any;
        putData: (...args: any[]) => any;
    };
}
import { Control } from "rete";
