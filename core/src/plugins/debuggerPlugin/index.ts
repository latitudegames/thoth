import { IRunContextEditor } from '../../../types'
import { ThothComponent } from '../../thoth-component'
import { outputNameFromSocketKey } from '../../utils/nodeHelpers'
import { ThothConsole } from './ThothConsole'

function install(
  editor: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  // const _log = console.log

  // console.log = function (message) {
  //   // if (editor.thoth.sendToDebug) editor.thoth.sendToDebug(message)
  //   console.warn('testing')
  //   return Function.prototype.bind.call(_log, arguments)
  // }

  editor.on('componentregister', (component: ThothComponent<unknown>) => {
    const worker = component.worker

    component.worker = async (node, inputs, outputs, data, ...args) => {
      node.console = new ThothConsole({
        node,
        component,
        editor,
        server,
        throwError,
      })

      try {
        let result = await worker.apply(component, [
          node,
          inputs,
          outputs,
          data,
          ...args,
        ])

        // Hacky way to handle when the spell component returns a response with a UUID in it
        if (component.name === 'Spell') {
          result = Object.entries(result).reduce((acc, [uuid, value]) => {
            const name = outputNameFromSocketKey(node, uuid)
            if (!name) return acc

            acc[name] = value
            return acc
          }, {} as Record<string, any>)
        }

        node.console.log(result)

        return result
      } catch (error: any) {
        node.console.error(error)
        throw error
      }
    }
  })
}

const defaultExport = {
  name: 'debuggerPlugin',
  install,
}

export default defaultExport
