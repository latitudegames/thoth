import { getComponents } from './src/components/components'
import { initEditor } from './src/editor'
import { Task } from './src/plugins/taskPlugin/task'

export { getComponents } from './src/components/components'
export { initEditor } from './src/editor'
export type { EngineContext } from './src/engine'
export { Task } from './src/plugins/taskPlugin/task'

export default {
  getComponents,
  initEditor,
  Task,
}
