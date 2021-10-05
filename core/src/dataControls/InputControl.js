import { DataControl } from '../plugins/inspectorPlugin'

export class InputControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand' }) {
    const options = {
      dataKey: dataKey,
      name: name,
      component: 'input',
      icon,
    }

    super(options)
  }

  onData() {
    return
  }
}
