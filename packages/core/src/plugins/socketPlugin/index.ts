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
    const worker = component.worker
    // const builder = component.builder

    component.worker = async (node, inputs, outputs, data, ...args) => {
      const result = await worker.apply(component, [
        node,
        inputs,
        outputs,
        data,
        ...args,
      ])
      if (server) {
        socket?.emit('worker', {
          nodeId: node.id,
          result,
        })
        return result
      }

      if (client) {
        client.io.on('worker', (data: unknown) => {
          console.log('DATA RECEIVED', data)
        })
      }
    }
  })
}

const defaultExport = {
  name: 'socketPlugin',
  install,
}

export default defaultExport
