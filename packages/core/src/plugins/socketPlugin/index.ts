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
  if (client) {
    client.io.on('worker', (data: unknown) => {
      console.log('DATA RECEIVED', data)
    })
  }

  editor.on('componentregister', (component: ThothComponent<unknown>) => {
    const worker = component.worker
    const builder = component.builder

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
          result: {
            output: result?.output,
          },
        })

        socket?.emit(`${node.id}`, {
          output: result?.output,
        })
        return result
      }
    }

    component.builder = node => {
      if (client) {
        client.io.on(node.id, (data: unknown) => {
          console.log('DATA RECEIVED', node.id, data)
        })
      }
      return builder.call(component, node)
    }
  })
}

const defaultExport = {
  name: 'socketPlugin',
  install,
}

export default defaultExport
