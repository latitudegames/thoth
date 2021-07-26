import Rete from "rete";
import Task from "../plugins/taskPlugin/task"
export abstract class ThothReteComponent extends Rete.Component {
  task: { outputs: object };
  category: string;
  info: string;
  display: bool;
  _task: Task;
}
    
