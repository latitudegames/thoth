import { auth } from './routes/auth/login'
import { chains } from './routes/chains/chains'
import { spells } from './routes/spells'
import { agents } from './routes/agents'
import { Route } from './types'

export const routes: Route[] = [
  ...chains,
  ...spells,
  ...auth,
  ...agents
]
