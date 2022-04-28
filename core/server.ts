import { getComponents, components } from './src/components/components'
import { initSharedEngine } from './src/engine'
import { Task } from './src/plugins/taskPlugin/task'
import { ThothComponent } from './src/thoth-component'
import SpellRunner from './src/utils/SpellRunner'

export { getComponents } from './src/components/components'
export { Task } from './src/plugins/taskPlugin/task'
export { initSharedEngine }
export { SpellRunner }

export default {
  components,
  getComponents,
  initSharedEngine,
  Task,
  ThothComponent,
  SpellRunner,
}
