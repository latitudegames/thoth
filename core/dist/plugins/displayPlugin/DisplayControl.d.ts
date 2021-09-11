export class DisplayControl extends Control {
    constructor({ key, defaultDisplay }: {
        key: any;
        defaultDisplay?: string | undefined;
    });
    render: string;
    component: (props: any) => JSX.Element;
    props: {
        display: string;
    };
    display(val: any): void;
}
import { Control } from "rete";
