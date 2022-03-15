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
} from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket, anySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info =
  'ML Profanity Detector can detect whether or not a phrase is a greeting, using Hugging Face'

type InputReturn = {
  output: unknown
  type: string
}

function getValue(labels: any, scores: any, key: string) {
  for (let i = 0; i < labels.length; i++) {
    if (labels[i] === key) {
      return scores[i]
    }
  }

  return 0
}

export class MLProfanityDetector extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('ML Profanity Detector')

    this.task = {
      outputs: {
        true: 'option',
        false: 'option',
        output: 'output',
        type: 'output',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)
    const out = new Rete.Output('output', 'output', anySocket)
    const typeOut = new Rete.Output('type', 'type', stringSocket)

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
      .addOutput(out)
      .addOutput(typeOut)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    console.log('ml profanity detector, url:', process.env.REACT_APP_API_URL)
    const action = inputs['string'][0]
    const params = {
      candidate_labels: ['Profane', 'Not Profane'],
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

    const _success = resp.data.success
    const r = resp.data.data

    const profane = getValue(r.labels, r.scores, 'Profane')
    const notProfane = getValue(r.labels, r.scores, 'Not Profane')
    const diff =
      profane > notProfane ? profane - notProfane : notProfane - profane
    const is = _success && diff > minDiff && profane > notProfane
    let type = ''
    let success = false

    if (is) {
      const parameters = {
        candidate_labels: ['Violoent', 'Sexual', 'Offensive', 'Questionable'],
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

      success = resp.data.success
      const result = resp.data.data

      const score1 = getValue(result.labels, result.scores, 'Violent') //Violent
      const score2 = getValue(result.labels, result.scores, 'Sexual') //Sexual
      const score3 = getValue(result.labels, result.scores, 'Offensive') //Offensive
      const score4 = getValue(result.labels, result.scores, 'Questionable') //Questionable

      if (score1 > score2 && score1 > score3 && score1 > score4) {
        type = 'violent'
      } else if (score2 > score1 && score2 > score3 && score2 > score4) {
        type = 'sexual'
      } else if (score3 > score1 && score3 > score2 && score3 > score4) {
        type = 'offensive'
      } else if (score4 > score1 && score4 > score2 && score4 > score3) {
        type = 'questionable'
      }
    }

    this._task.closed = success && type.length > 0 ? ['false'] : ['true']

    return {
      output: action as string,
      type: type,
    }
  }
}
