import { DataControl } from '../plugins/inspectorPlugin'

export class SwitchControl extends DataControl {
  constructor({ dataKey, name, icon = 'hand', checked = false }) {
    const options = {
      dataKey: dataKey,
      name,
      component: 'switch',
      icon,
      checked,
    }

    super(options)
  }

  onData() {
    return
  }
}
