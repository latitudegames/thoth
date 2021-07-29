import Rete from "rete";
import { Task } from "../plugins/taskPlugin/task"

// Note: We do this so Typescript knows what extra properties we're
// adding to the NodeEditor (in rete/editor.js). In an ideal world, we
// would be extending the class there, when we instantiate it.
class ThothReteNodeEditor extends Rete.NodeEditor {
    pubSub 
    thoth
    tab
}

export abstract class ThothReteComponent extends Rete.Component {
  editor: ThothReteNodeEditor
  task: { outputs: { [key: string]: string }, init: (task: Task) => void };
  category: string;
  info: string;
  display: boolean;
  _task: Task;
}
    
