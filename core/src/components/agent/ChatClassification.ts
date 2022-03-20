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
import { EngineContext } from '../../engine'
import { stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Chat Classification is used to classify the type of the chat between the user and the agent'

function getValue(labels: any, scores: any, key: string) {
  for (let i = 0; i < labels.length; i++) {
    if (labels[i] === key) {
      return scores[i]
    }
  }

  return 0
}

export class ChatClassification extends ThothComponent<Promise<void>> {
  constructor() {
    super('Chat Classification')

    this.task = {
      outputs: {
        hostile: 'option',
        threatening: 'option',
        helpful: 'option',
        kind: 'option',
        neutral: 'option',
        output: 'output',
      },
    }

    this.category = 'Conversation'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isHostile = new Rete.Output('hostile', 'Hostile', triggerSocket)
    const isThreatening = new Rete.Output(
      'threatening',
      'Threatening',
      triggerSocket
    )
    const isHelpful = new Rete.Output('helpful', 'Helpful', triggerSocket)
    const isKind = new Rete.Output('kind', 'Kind', triggerSocket)
    const isNeutral = new Rete.Output('neutral', 'Neutral', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isHostile)
      .addOutput(isThreatening)
      .addOutput(isHelpful)
      .addOutput(isKind)
      .addOutput(isNeutral)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0]
    const parameters = {
      candidate_labels: [
        'hostile',
        'threatening',
        'helpful',
        'kind',
        'neutral',
      ],
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

    if (success) {
      const hostile = getValue(data.labels, data.scores, 'hostile')
      const threatening = getValue(data.labels, data.scores, 'threatening')
      const helpful = getValue(data.labels, data.scores, 'helpful')
      const kind = getValue(data.labels, data.scores, 'kind')
      const neutral = getValue(data.labels, data.scores, 'neutral')

      if (
        hostile > threatening &&
        hostile > helpful &&
        hostile > kind &&
        hostile > neutral
      ) {
        console.log('hostile')
        this._task.closed = ['threatening', 'helpful', 'kind', 'neutral']
      } else if (
        threatening > hostile &&
        threatening > helpful &&
        threatening > kind &&
        threatening > neutral
      ) {
        console.log('threatening')
        this._task.closed = ['hostile', 'helpful', 'kind', 'neutral']
      } else if (
        helpful > hostile &&
        helpful > threatening &&
        helpful > kind &&
        helpful > neutral
      ) {
        console.log('helpful')
        this._task.closed = ['hostile', 'threatening', 'kind', 'neutral']
      } else if (
        kind > hostile &&
        kind > threatening &&
        kind > helpful &&
        kind > neutral
      ) {
        console.log('kind')
        this._task.closed = ['hostile', 'threatening', 'helpful', 'neutral']
      } else if (
        neutral > hostile &&
        neutral > threatening &&
        neutral > helpful &&
        neutral > kind
      ) {
        console.log('neutral')
        this._task.closed = ['hostile', 'threatening', 'helpful', 'kind']
      } else {
        console.log('neutral else')
        this._task.closed = ['hostile', 'threatening', 'helpful', 'kind']
      }
    } else {
      console.log('neutral else else')
      this._task.closed = ['hostile', 'threatening', 'helpful', 'kind']
    }
  }
}
