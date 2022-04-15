import { NodeData } from '../../types'

type Inputs = {
  socketKey: string
  name: string
}

export const inputNameFromSocketKey = (node: NodeData, socketKey: string) => {
  return (node.data.inputs as Inputs[]).find(
    input => input.socketKey === socketKey
  )?.name
}
