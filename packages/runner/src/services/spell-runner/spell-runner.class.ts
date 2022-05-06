import {
  Id,
  NullableId,
  Paginated,
  Params,
  ServiceMethods,
} from '@feathersjs/feathers'
import { getSpell } from '../../api/spell'
import { Application } from '../../declarations'

interface Data {}

interface ServiceOptions {}

type UserInfo = {
  id: string
}
interface SpellRunnerParams extends Params {
  user: UserInfo
}

export class SpellRunner implements ServiceMethods<Data> {
  app: Application
  options: ServiceOptions

  constructor(options: ServiceOptions = {}, app: Application) {
    this.options = options
    this.app = app
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-varswaaaa
  async find(params?: Params): Promise<Data[] | Paginated<Data>> {
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async get(id: Id, params?: SpellRunnerParams): Promise<Data> {
    if (!this.app.userSpellManagers) return {}
    if (!params) throw new Error('No params present in service')

    const { user } = params

    if (!user) throw new Error('No user is present in service')
    // Here we get the users spellManagerApp
    const spellManager = this.app.userSpellManagers.get(user.id)

    if (!spellManager) throw new Error('No spell manager created for user!')

    const spell = await getSpell(id as string)

    console.log('spell found!', spell)

    return {
      id,
      text: `A new message with ID: ${id}!`,
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async create(data: Data, params?: Params): Promise<Data> {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)))
    }

    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async patch(id: NullableId, data: Data, params?: Params): Promise<Data> {
    return data
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async remove(id: NullableId, params?: Params): Promise<Data> {
    return { id }
  }
}
