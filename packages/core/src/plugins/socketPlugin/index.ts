import { IRunContextEditor, ThothComponent } from '../../../types'

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: ThothComponent<unknown>) => {
    const worker = component.worker

    component.worker = (node, inputs, outputs, data, ...args) => {
      // if (displayMap[node.id])
      //   node.display = displayMap[node.id].display.bind(displayMap[node.id])

      // // handle modules, which are in the engine run
      // if (data?.silent) node.display = () => {}

      return worker.apply(component, [node, inputs, outputs, data, ...args])
    }
  })
}

const defaultExport = {
  name: 'socketPlugin',
  install,
}

export default defaultExport
