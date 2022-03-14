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

export type Message = {
  from: string
  nodeId: number
  name: string | null
  content?: string
  type: 'error' | 'log'
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

  formatMessage(_message: string, type: 'error' | 'log'): Message {
    return {
      from: this.node.name,
      nodeId: this.node.id,
      name: (this.node?.data?.name as string) ?? null,
      content: _message,
      type,
    }
  }

  formatErrorMessage(error: any) {
    return this.formatMessage(error.message, 'error')
  }

  renderError() {
    this.node.data.error = true
    this.updateNodeView()
    this.node.data.error = false
  }

  renderSuccess() {
    this.node.data.success = true
    this.updateNodeView()
    this.node.data.success = false
  }

  log(message: any) {
    this.sendToDebug(message)
  }

  error(error: any) {
    const message = this.formatErrorMessage(error)
    this.sendToDebug(message)
    this.throwServerError(message)
    this.renderError()
  }

  sendSuccess(result: any) {}

  sendToDebug(message: any) {
    if (this.editor.thoth.sendToDebug) this.editor.thoth.sendToDebug(message)
  }

  throwServerError(message: any) {
    if (this.isServer && this.throwError) this.throwError(message)
  }
}
