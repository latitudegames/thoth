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
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { EngineContext } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Classifier takes an input string and arbitrary labels and returns the most likely label'

function getValue(labels: any, scores: any, key: string) {
  for (let i = 0; i < labels.length; i++) {
    if (labels[i] === key) {
      return scores[i]
    }
  }

  return 0
}

export class Destructure extends ThothComponent<Promise<any>> {
  constructor() {
    super('Destructure')

    this.task = {
      outputs: {
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const input = new Rete.Input('input', 'Input', stringSocket)

    const outputGenerator = new SocketGeneratorControl({
      connectionType: 'output',
      ignored: ['trigger'],
      name: 'Output Sockets',
    })

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    node.inspector.add(nameControl).add(outputGenerator)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    return node.addOutput(dataOutput).addInput(input).addInput(dataInput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['input'][0]

    const nodeOutputs = (
      node.data.outputs as {
        name: string
        [key: string]: unknown
      }[]
    ).keys()

    const parameters = {
      candidate_labels: nodeOutputs,
    }

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/hf_request`,
      {
        inputs: action as string,
        model: 'facebook/bart-large-mnli',
        parameters: parameters,
        options: undefined,
      }
    )

    const { data, success } = resp.data

    const results = {} as any
    this._task.closed = ['trigger']

    for (const key in nodeOutputs) {
      results[key] = success
        ? getValue(data.outputs.labels, data.outputs.scores, key)
        : 0
    }

    if (!silent) node.display(results)

    return results
  }
}
