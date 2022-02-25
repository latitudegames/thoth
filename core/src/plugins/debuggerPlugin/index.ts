import { Component, NodeEditor } from 'rete/types'
import { EngineContext } from '../../engine'

interface IRunContextEditor extends NodeEditor {
  thoth: EngineContext
}

function install(editor: IRunContextEditor) {
  editor.on('componentregister', (component: Component) => {
    const worker = component.worker

    component.worker = (node, inputs, outputs, data, ...args) => {
      try {
        return worker.apply(component, [node, inputs, outputs, data, ...args])
      } catch (error: any) {
        if (!editor.thoth.sendToDebug) return
        editor.thoth.sendToDebug({ message: error })
        console.error(error)
      }
    }
  })
}

const defaultExport = {
  name: 'debuggerPlugin',
  install,
}

export default defaultExport
