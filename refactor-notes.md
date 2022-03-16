Refactoring

- Revert all core components
- organise components into folders for easy visibility into ownership and core functionality
- better use of interfaces. All client completions cant still go direct against latitude

- add dev flags for components not intended for production

Development Flow

- easiest version
  - log in with latitude account, it gets an API key for you and populate syour local DB. Away you go.
  - or can turn off latitude auth, and develop locally with a private API access key.

Questions

- if we have the client run against the latitude API directly, we reduce needing of duplicating endpoints in thothserver just to proxy through to latitude API. However that would require users developing to have a latitude account to run our interface for thoth on the client side.
- we could mirror the latitude API in the thoth API and have all client calls first go to thoth server. Might work well.
- Perhaps the real solution here is that all everything latitude related should go through a dedicated interface and no mirror any endpoints?
- how do we allow other plugin components running on the server to use the latitude API from server-side? Need the api key for the user stored in the DB. Or a token override provided. Maybe .env latitude api token overrides the user based on in the DB if it exists?

NEEDS

- way for plugins to also provide their own interfaces to compose them all together for client and server runtime usage?
