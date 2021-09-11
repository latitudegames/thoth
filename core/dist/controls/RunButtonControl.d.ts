export class RunButtonControl extends Control {
    constructor({ key, emitter, run }: {
        key: any;
        emitter: any;
        run: any;
    });
    render: string;
    component: (props: any) => JSX.Element;
    props: {
        emitter: any;
        run: any;
        getNode: any;
    };
}
import { Control } from "rete";
