export type AddClient = {
  client: string
  name: string
  type: string
  defaultValue: string
}

export type EditClient = {
  name: string
  defaultValue: string
  id: string
}
