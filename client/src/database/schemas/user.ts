const userSchema = {
  title: 'user schema',
  version: 0,
  description: 'The main user object',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      primary: true,
    },
    username: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    accessToken: {
      type: 'string',
    },
    groups: {
      type: 'array',
    },
    lastLogin: {
      type: 'number',
    },
    authData: {
      type: 'string',
    },
  },
}

const collection = {
  user: {
    schema: userSchema,
  },
}

export default collection
