import io from 'socket.io'
import { IRunContextEditor, ThothComponent } from '../../../types'

function install(
  editor: IRunContextEditor,
  // Need to better type the feathers client here
  {
    server = false,
    socket,
    client,
  }: { server?: boolean; socket?: io.Socket; client?: any }
) {
  editor.on('componentregister', (component: ThothComponent<unknown>) => {
    component.worker = async (node, inputs, outputs, context, ta, ...args) => {
      if (context.socketOutput) {
        return context.socketOutput
      }
    }
  })
}

const defaultExport = {
  name: 'socketOverridePlugin',
  install,
}

export default defaultExport
