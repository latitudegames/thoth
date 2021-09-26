import { components } from './components/components'
import { initEditor } from './editor'
import { Task } from './plugins/taskPlugin/task'

export { components } from './components/components'
export { initEditor } from './editor'
export type { EngineContext } from './engine'
export { Task } from './plugins/taskPlugin/task'

export default {
  components,
  initEditor,
  Task,
}
