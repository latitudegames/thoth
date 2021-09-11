export class Inspector {
    constructor({ component, editor, node }: {
        component: any;
        editor: any;
        node: any;
    });
    onData: () => void;
    cache: {};
    component: any;
    editor: any;
    dataControls: Map<any, any>;
    node: any;
    category: any;
    info: any;
    _add(list: any, control: any, prop: any): void;
    add(dataControl: any): Inspector;
    handleSockets(sockets: any, control: any, type: any): void;
    cacheControls(dataControls: any): void;
    handleData(update: any): void;
    get(key: any): void;
    data(): {
        name: any;
        nodeId: any;
        dataControls: {};
        data: any;
        category: any;
        info: any;
    };
    remove(key: any): void;
}
