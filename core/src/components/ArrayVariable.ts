/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { arraySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = `Array Variable`

type InputReturn = {
  output: string[]
}

export class ArrayVariable extends ThothComponent<InputReturn> {
  constructor() {
    super('Array Variable')

    this.task = {
      outputs: {
        output: 'output',
      },
    }

    this.category = 'Variable'
    this.info = info
    this.display = true
  }

  builder(node: ThothNode) {
    const out = new Rete.Output('output', 'output', arraySocket)
    const _var = new InputControl({
      dataKey: 'var',
      name: 'Variable',
      icon: 'moon',
    })
    const splitter = new InputControl({
      dataKey: 'splitter',
      name: 'Splitter',
      icon: 'moon',
    })
    const name = new InputControl({
      dataKey: 'name',
      name: 'Name',
      icon: 'moon',
    })

    node.inspector.add(_var).add(splitter).add(name)

    return node.addOutput(out)
  }

  worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, data }: { silent: boolean; data: string | undefined }
  ) {
    const _var = node?.data?._var as string
    const splitter = node?.data?._var as string
    const res = _var.split(splitter)

    this.name = node?.data?.name as string

    return {
      output: res,
    }
  }
}
