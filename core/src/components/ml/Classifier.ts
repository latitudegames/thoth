/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { InputControl } from '../../dataControls/InputControl'
import { EngineContext } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Classifier takes an input string and arbitrary labels and returns the most likely label'

type InputReturn = {
  output: unknown
}

export class Classifier extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Classifier')

    this.task = {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const input = new Rete.Input('input', 'Input', stringSocket)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    const labelControl = new InputControl({
      dataKey: 'labels',
      name: 'Labels',
    })

    node.inspector.add(nameControl).add(labelControl)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket, true)

    return node
      .addOutput(output)
      .addOutput(dataOutput)
      .addInput(input)
      .addInput(dataInput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const inputData = inputs['input'][0]
    const labelData = (node.data?.labels as string).split(', ')

    const parameters = {
      candidate_labels: labelData,
    }

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/hf_request`,
      {
        inputs: inputData as string,
        model: 'facebook/bart-large-mnli',
        parameters: parameters,
        options: undefined,
      }
    )

    const { data, success, error } = resp.data

    if (!silent) {
      if (!success) node.display(error)
      else node.display('Top label is ' + data.labels[0])
    }
    console.log('Top label is ' + data.labels[0])
    return { output: data.labels[0] }
  }
}
