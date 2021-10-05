import Rete from 'rete'

import * as sockets from '../../sockets'

function install(editor) {
  editor.on('componentregister', component => {
    const builder = component.builder

    // we are going to override the default builder with our own, and will invoke the original builder inside it.
    component.builder = node => {
      // Handle outputs in the nodes data to repopulate when loading from JSON
      if (node.data.outputs && node.data.outputs.length !== 0) {
        const outputMap = {}
        node.outputs.forEach((value, key) => {
          outputMap[key] = value
        })

        node.data.outputs.forEach(socket => {
          if (!outputMap[socket.socketKey]) {
            const output = new Rete.Output(
              socket.socketKey ? socket.socketKey : socket.name,
              socket.name,
              sockets[socket.socketType]
            )
            node.addOutput(output)
          }
        })
      }

      if (node.data.outputs && node.data.outputs.length > 0) {
        component.task.outputs = node.data.outputs.reduce(
          (acc, out) => {
            acc[out.socketKey] = out.taskType || 'output'
            return acc
          },
          { ...component.task.outputs }
        )
      }

      if (node.data.inputs && node.data.inputs.length !== 0) {
        // get inputs from node.inputs
        const inputMap = {}
        node.inputs.forEach((value, key) => {
          inputMap[key] = value
        })

        node.data.inputs.forEach(socket => {
          // If the input key is already on the node, return
          if (inputMap[socket.socketKey]) return
          const input = new Rete.Input(
            socket.socketKey ? socket.socketKey : socket.name,
            socket.name,
            sockets[socket.socketType]
          )
          node.addInput(input)
        })
      }

      builder.call(component, node)
    }
  })
}

const defaultExport = {
  name: 'socketGenerator',
  install,
}

export default defaultExport
