import { Application as ExpressFeathers } from '@feathersjs/express'
import { SpellManager } from '@latitudegames/thoth-core/dist/server'

// A mapping of service names to types. Will be extended in service files.
export interface ServiceTypes {}
// The application instance type that will be used everywhere else
export interface Application extends ExpressFeathers<ServiceTypes> {
  userSpellManagers?: Map<string, SpellManager>
}
