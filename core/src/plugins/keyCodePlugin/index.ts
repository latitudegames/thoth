import { IRunContextEditor, ThothNode } from '../../../types'

function install(editor: IRunContextEditor) {
  let currentNode: ThothNode | undefined

  editor.on('nodeselect', (node: ThothNode) => {
    if (currentNode && node.id === currentNode.id) return
    currentNode = node
  })

  editor.on('keydown', (event: KeyboardEvent) => {
    if (!currentNode) return
    if (event.key === 'Delete') {
      editor.removeNode(currentNode)
    }
  })
}

const defaultExport = {
  name: 'keycodePlugin',
  install,
}

export default defaultExport
