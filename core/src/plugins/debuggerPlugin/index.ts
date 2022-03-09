import { IRunContextEditor } from '../../../types'
import { ThothComponent } from '../../thoth-component'
import { ThothConsole } from './ThothConsole'

function install(
  editor: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  const consoleLog = console.log

  console.log = function (message) {
    // if (editor.thoth.sendToDebug) editor.thoth.sendToDebug(message)
    consoleLog.apply(console, arguments)
  }

  editor.on('componentregister', (component: ThothComponent<unknown>) => {
    const worker = component.worker

    component.worker = (node, inputs, outputs, data, ...args) => {
      node.console = new ThothConsole({
        node,
        component,
        editor,
        server,
        throwError,
      })

      try {
        const result = worker.apply(component, [
          node,
          inputs,
          outputs,
          data,
          ...args,
        ])

        node.console.renderSuccess()

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
