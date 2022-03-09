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

  constructor({ component, editor, node }: ConsoleConstructor) {}
}
