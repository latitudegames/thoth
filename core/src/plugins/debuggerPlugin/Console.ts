import { NodeView } from 'rete/types/view/node'
import { IRunContextEditor, ThothNode } from '../../../types'
import { ThothComponent } from '../../thoth-component'

type ConsoleConstructor = {
  component: ThothComponent<unknown>
  editor: IRunContextEditor
  node: ThothNode
}

export class Console {
  node: ThothNode
  editor: IRunContextEditor
  component: ThothComponent<unknown>
  nodeView: NodeView

  constructor({ component, editor, node }: ConsoleConstructor) {
    this.component = component
    this.editor = editor
    this.node = node

    const nodeValues = Array.from(editor.view.nodes)
    const foundNode = nodeValues.find(([, n]) => n.node.id === node.id)

    if (!foundNode) return

    this.nodeView = foundNode[1]
  }

  updateNodeView() {
    this.nodeView.onStart()
    this.nodeView.node.update()
  }
}
