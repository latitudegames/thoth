import { DataControl } from '../plugins/inspectorPlugin'

export class PlaytestControl extends DataControl {
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
      component: 'playtest',
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
