import { NodeEditor } from "rete";
import { EventsTypes as DefaultEventsTypes } from "rete/types/events";
interface EventsTypes extends DefaultEventsTypes {
    run: void;
    save: void;
    [key: string]: any;
}
declare class ThothEditor extends NodeEditor<EventsTypes> {
    pubSub: any;
    thoth: any;
    thothV2: any;
    tab: any;
    abort: any;
    loadGraph: any;
    moduleSubscription: any;
    moduleManager: any;
}
declare const editor: ({ container, pubSub, thoth, tab, thothV2, node }: {
    container: any;
    pubSub: any;
    thoth: any;
    tab: any;
    thothV2: any;
    node: any;
}) => Promise<ThothEditor>;
export default editor;
