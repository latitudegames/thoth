import { auth } from './routes/auth/login'
import { completions } from './routes/completions'
import { entities } from './routes/entities'
import { settings } from './routes/settings'
import { spells } from './routes/spells'
import { Route } from './types'

export const routes: Route[] = [
  ...spells,
  ...auth,
  ...entities,
  ...completions,
  ...settings,
]
