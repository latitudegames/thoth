import { DataControl } from '../plugins/inspectorPlugin'

export class SwitchControl extends DataControl {
  constructor({
    dataKey,
    name,
    icon = 'hand',
    label = 'Toggle',
    defaultValue = false,
  }) {
    const options = {
      dataKey: dataKey,
      defaultValue,
      name,
      component: 'switch',
      icon,
      data: {
        label,
      },
    }

    super(options)
  }

  onData() {
    return
  }
}
