import { components } from './src/components/components'
import { initEditor } from './src/editor'
import { Task } from './src/plugins/taskPlugin/task'

export { components } from './src/components/components'
export { initEditor } from './src/editor'
export type { EngineContext } from './src/engine'
export { Task } from './src/plugins/taskPlugin/task'

export default {
  components,
  initEditor,
  Task,
}
