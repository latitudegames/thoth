import { DataControl } from '../plugins/inspectorPlugin'

export class SpellControl extends DataControl {
  constructor({ name, icon = 'sieve' }: { name: string; icon?: string }) {
    const options = {
      dataKey: 'spell',
      name: name,
      component: 'spellSelect',
      icon,
    }

    super(options)
  }
}
