import { IRunContextEditor } from '../../../types'
import { ThothComponent } from '../../thoth-component'
import { ThothConsole } from './ThothConsole'

function install(
  editor: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  editor.on('componentregister', (component: ThothComponent<unknown>) => {
    const worker = component.worker
    const builder = component.builder

    component.builder = node => {
      node.data.error = false

      return builder.call(component, node)
    }

    component.worker = (node, inputs, outputs, data, ...args) => {
      node.console = new ThothConsole({
        node,
        component,
        editor,
        server,
        throwError,
      })
      node.data.error = false

      try {
        const result = worker.apply(component, [
          node,
          inputs,
          outputs,
          data,
          ...args,
        ])

        return result
      } catch (error: any) {
        node.console.sendError(error)
      }
    }
  })
}

const defaultExport = {
  name: 'debuggerPlugin',
  install,
}

export default defaultExport
