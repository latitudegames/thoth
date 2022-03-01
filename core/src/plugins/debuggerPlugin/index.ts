import { NodeEditor } from 'rete/types'
import { Node } from 'rete'
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
          errorMessage: error.stack,
        })
        node.data.error = true

        // const fullNode = Node.fromJSON(node)
        // console.log('node object', fullNode)
        // editor.selectNode(fullNode)
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
