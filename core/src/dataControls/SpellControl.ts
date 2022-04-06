import { DataControl } from '../plugins/inspectorPlugin'

export class SpellControl extends DataControl {
  constructor({
    name,
    icon = 'sieve',
    write = false,
  }: {
    name: string
    icon?: string
    write: boolean
  }) {
    const options = {
      dataKey: 'spell',
      name: name,
      component: 'spellSelect',
      write,
      icon,
    }

    super(options)
  }
}
