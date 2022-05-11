import { NodeData } from '../../types'

type Inputs = {
  socketKey: string
  name: string
}

type Outputs = Inputs

export const inputNameFromSocketKey = (node: NodeData, socketKey: string) => {
  return (node.data.inputs as Inputs[]).find(
    input => input.socketKey === socketKey
  )?.name
}

export const socketKeyFromOutputName = (node: NodeData, name: string) => {
  return (node.data.outputs as Outputs[]).find(output => output.name === name)
    ?.socketKey
}
