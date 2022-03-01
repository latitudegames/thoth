import { NodeEditor } from 'rete/types'
import { EngineContext } from '../../engine'
import { ThothComponent } from '../../thoth-component'
interface IRunContextEditor extends NodeEditor {
  thoth: EngineContext
  abort: Function
}

function install(editor: IRunContextEditor) {
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
        if (!editor.thoth.sendToDebug) return

        editor.thoth.sendToDebug({
          errorIn: node.name,
          errorMessage: node.data.display,
        })
        node.data.error = true

        const nodeView = [...editor.view.nodes.values()].find(
          n => n.node.id === node.id
        )

        nodeView?.onStart()
        nodeView?.node.update()
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
