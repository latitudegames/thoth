import { NodeEditor } from 'rete'
import { NodeData } from 'rete/types/core/data'

import { ThothComponent } from '../../thoth-component'
import { ThothWorkerInputs } from '../../types'
import { Task } from './task'

function install(editor: NodeEditor) {
  editor.on('componentregister', (component: ThothComponent) => {
    if (!component.task)
      throw new Error('Task plugin requires a task property in component')
    if (component.task.outputs.constructor !== Object)
      throw new Error(
        'The "outputs" field must be an object whose keys correspond to the Output\'s keys'
      )

    const taskWorker = component.worker
    const taskOptions = component.task

    component.worker = (
      node: NodeData,
      inputs,
      outputs,
      args: unknown[],
      ...rest
    ) => {
      const task = new Task(
        inputs,
        component,
        node,
        (
          ctx: unknown,
          inputs: ThothWorkerInputs,
          data: NodeData,
          socketInfo: string | null
        ) => {
          component._task = task
          // might change this interface, since we swap out data for outputs here, which just feels wrong.
          return taskWorker.call(
            component,
            node,
            inputs,
            outputs,
            { ...args, data, socketInfo },
            ...rest
          )
        }
      )

      if (taskOptions.init) taskOptions.init(task, node)

      Object.keys(taskOptions.outputs).forEach(key => {
        outputs[key] = { type: taskOptions.outputs[key], key, task }
      })
    }
  })
}

export { Task } from './task'

const defaultExport = {
  name: 'task',
  install,
}

export default defaultExport
