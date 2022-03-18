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
  'ML Question Detector can detect whether or not a phrase is a question, using Hugging Face'

function getValue(labels: any, scores: any, key: string) {
  for (let i = 0; i < labels.length; i++) {
    if (labels[i] === key) {
      return scores[i]
    }
  }

  return 0
}

export class MLQuestionDetector extends ThothComponent<Promise<void>> {
  constructor() {
    super('ML Question Detector')

    this.task = {
      outputs: {
        true: 'option',
        false: 'option',
      },
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
    console.log('ml greeting detector')
    const action = inputs['string'][0]
    const params = {
      candidate_labels: ['Question', 'Not Question'],
    }
    const minDiffData = node?.data?.minDiff as string
    const minDiff = minDiffData ? parseFloat(minDiffData) : 0.4

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/hf_request`,
      {
        inputs: action as string,
        model: 'facebook/bart-large-mnli',
        parameters: params,
        options: undefined,
      }
    )

    const { success, data } = resp.data
    const r = data

    const question = getValue(r.labels, r.scores, 'Question')
    const notQuestion = getValue(r.labels, r.scores, 'Not Question')
    const diff =
      question > notQuestion ? question - notQuestion : notQuestion - question
    const is = diff > minDiff && question > notQuestion

    this._task.closed = success && is ? ['false'] : ['true']
  }
}
