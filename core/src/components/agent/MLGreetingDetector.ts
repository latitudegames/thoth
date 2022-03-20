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
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'ML Greeting Detector can detect whether or not a phrase is a greeting, using Hugging Face'

function getValue(labels: any, scores: any, key: string) {
  for (let i = 0; i < labels.length; i++) {
    if (labels[i] === key) {
      return scores[i]
    }
  }

  return 0
}

export class MLGreetingDetector extends ThothComponent<Promise<void>> {
  constructor() {
    super('ML Greeting Detector')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }

    this.category = 'Conversation'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    const minDiff = new InputControl({
      dataKey: 'minDiff',
      name: 'Min Difference',
      icon: 'moon',
    })

    node.inspector.add(minDiff)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    console.log('ml greeting detector, url:', process.env.REACT_APP_API_URL)
    const action = inputs['string'][0]
    const minDiffData = node?.data?.minDiff as string
    const minDiff = minDiffData ? parseFloat(minDiffData) : 0.4
    const parameters = {
      candidate_labels: ['Greeting', 'Not Greeting'],
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

    const { success, data } = resp.data
    const result = data

    const greeting = getValue(result.labels, result.scores, 'Greeting')
    const notGreeting = getValue(result.labels, result.scores, 'Not Greeting')
    const diff =
      notGreeting > greeting ? notGreeting - greeting : greeting - notGreeting
    const is = diff > minDiff && greeting > notGreeting

    this._task.closed = success && is ? ['false'] : ['true']
  }
}
