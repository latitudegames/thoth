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

const info = 'Input Classification is used to classify the type of a string'

function getValue(labels: any, scores: any, key: string) {
  for (let i = 0; i < labels.length; i++) {
    if (labels[i] === key) {
      return scores[i]
    }
  }

  return 0
}

export class InputClassification extends ThothComponent<Promise<void>> {
  constructor() {
    super('Input Classification')

    this.task = {
      outputs: {
        casualGreeting: 'option',
        formalGreeting: 'option',
        casualQuestion: 'option',
        formalQuestion: 'option',
        biographicalQuestion: 'output',
        misc: 'output',
      },
    }

    this.category = 'Conversation'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const casualGreeting = new Rete.Output(
      'casualGreeting',
      'Casual Greeting',
      triggerSocket
    )
    const formalGreeting = new Rete.Output(
      'formalGreeting',
      'Formal Greeting',
      triggerSocket
    )
    const casualQuestion = new Rete.Output(
      'casualQuestion',
      'Casual Question',
      triggerSocket
    )
    const formalQuestion = new Rete.Output(
      'formalQuestion',
      'Formal Question',
      triggerSocket
    )
    const biographicalQuestion = new Rete.Output(
      'biographicalQuestion',
      'Biographical Question',
      triggerSocket
    )
    const misc = new Rete.Output('misc', 'Misc', triggerSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(casualGreeting)
      .addOutput(formalGreeting)
      .addOutput(casualQuestion)
      .addOutput(formalQuestion)
      .addOutput(biographicalQuestion)
      .addOutput(misc)
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
        'casualGreeting',
        'formalGreeting',
        'casualQuestion',
        'formalQuestion',
        'biographicalQuestion',
        'misc',
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
      const casualGreeting = getValue(
        data.labels,
        data.scores,
        'casualGreeting'
      )
      const formalGreeting = getValue(
        data.labels,
        data.scores,
        'formalGreeting'
      )
      const casualQuestion = getValue(
        data.labels,
        data.scores,
        'casualQuestion'
      )
      const formalQuestion = getValue(
        data.labels,
        data.scores,
        'formalQuestion'
      )
      const biographicalQuestion = getValue(
        data.labels,
        data.scores,
        'biographicalQuestion'
      )

      if (
        casualGreeting > formalGreeting &&
        casualGreeting > casualQuestion &&
        casualGreeting > formalQuestion &&
        casualGreeting > biographicalQuestion
      ) {
        console.log('casualGreeting')
        this._task.closed = [
          'formalGreeting',
          'casualQuestion',
          'formalQuestion',
          'biographicalQuestion',
          'misc',
        ]
      } else if (
        formalGreeting > casualGreeting &&
        formalGreeting > casualQuestion &&
        formalGreeting > formalQuestion &&
        formalGreeting > biographicalQuestion
      ) {
        console.log('formalGreeting')
        this._task.closed = [
          'casualGreeting',
          'casualQuestion',
          'formalQuestion',
          'biographicalQuestion',
          'misc',
        ]
      } else if (
        casualQuestion > casualGreeting &&
        casualQuestion > formalGreeting &&
        casualQuestion > formalQuestion &&
        casualQuestion > biographicalQuestion
      ) {
        console.log('casualQuestion')
        this._task.closed = [
          'casualGreeting',
          'formalGreeting',
          'formalQuestion',
          'biographicalQuestion',
          'misc',
        ]
      } else if (
        formalQuestion > casualGreeting &&
        formalQuestion > formalGreeting &&
        formalQuestion > casualQuestion &&
        formalQuestion > biographicalQuestion
      ) {
        console.log('formalQuestion')
        this._task.closed = [
          'casualGreeting',
          'formalGreeting',
          'casualQuestion',
          'biographicalQuestion',
          'misc',
        ]
      } else if (
        biographicalQuestion > casualGreeting &&
        biographicalQuestion > formalGreeting &&
        biographicalQuestion > casualQuestion &&
        biographicalQuestion > formalQuestion
      ) {
        console.log('biographicalQuestion')
        this._task.closed = [
          'casualGreeting',
          'formalGreeting',
          'casualQuestion',
          'formalQuestion',
          'misc',
        ]
      } else {
        console.log('biographicalQuestion else')
        this._task.closed = [
          'casualGreeting',
          'formalGreeting',
          'casualQuestion',
          'formalQuestion',
          'biographicalQuestion',
        ]
      }
    } else {
      console.log('biographicalQuestion else else')
      this._task.closed = [
        'casualGreeting',
        'formalGreeting',
        'casualQuestion',
        'formalQuestion',
        'biographicalQuestion',
      ]
    }
  }
}
