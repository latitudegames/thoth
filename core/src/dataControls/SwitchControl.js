import { DataControl } from '../plugins/inspectorPlugin'

export class SwitchControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand' }) {
    const options = {
      dataKey: dataKey,
      name,
      component: 'switch',
      icon,
    }

    super(options)
  }

  onData() {
    return
  }
}
