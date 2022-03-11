import { IRunContextEditor } from '../../../types'
import { ThothComponent } from '../../thoth-component'

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
        const message = {
          errorIn: node.name,
          errorMessage: error.message,
        }

        if (throwError) {
          throwError(message)
          return
        }

        if (editor.thoth.sendToDebug) editor.thoth.sendToDebug(message)

        if (!server) {
          node.data.error = true

          const nodeValues = Array.from(editor.view.nodes)
          const foundNode = nodeValues.find(([, n]) => n.node.id === node.id)

          if (!foundNode) return

          const nodeView = foundNode[1]

          nodeView?.onStart()
          nodeView?.node.update()
          throw error
        }
      }
    }
  })
}

const defaultExport = {
  name: 'debuggerPlugin',
  install,
}

export default defaultExport
