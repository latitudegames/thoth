import { NodeView } from 'rete/types/view/node'
import { IRunContextEditor, NodeData } from '../../../types'
import { ThothComponent } from '../../thoth-component'

type ConsoleConstructor = {
  component: ThothComponent<unknown>
  editor: IRunContextEditor
  node: NodeData
  server: boolean
  throwError?: Function
}

export class ThothConsole {
  node: NodeData
  editor: IRunContextEditor
  component: ThothComponent<unknown>
  nodeView: NodeView
  isServer: boolean
  throwError?: Function

  constructor({
    component,
    editor,
    node,
    server,
    throwError,
  }: ConsoleConstructor) {
    this.component = component
    this.editor = editor
    this.node = node
    this.isServer = server

    if (throwError) this.throwError = throwError

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
