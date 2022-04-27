import { ThothComponent } from '@latitudegames/thoth-core/src/thoth-component'
import { IRunContextEditor, NodeData } from '../../../types'
import { ThothConsole } from '../debuggerPlugin/ThothConsole'

function install(
  engine: IRunContextEditor,
  { server = false, throwError }: { server?: boolean; throwError?: Function }
) {
  engine.on(
    'error',
    ({ message, data }: { message: string; data: NodeData }) => {
      const component = engine.components.get(
        data.name
      ) as unknown as ThothComponent<unknown>
    }
  )
}
}
