/* eslint-disable no-async-promise-executor */
/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-inferrable-types */
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
import { NumberControl } from '../dataControls/NumberControl'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'Agent Text Completion is using OpenAI for the agent to respond.'

type WorkerReturn = {
  output: string
}

export class AgentTextCompletion extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Agent Text Completion')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('Voice', 'String', stringSocket)

    const modelName = new InputControl({
      dataKey: 'modelName',
      name: 'Model Name',
      icon: 'moon',
    })

    const temperature = new NumberControl({
      dataKey: 'temperature',
      name: 'Temperature',
      icon: 'moon',
    })

    const maxTokens = new NumberControl({
      dataKey: 'maxTokens',
      name: 'Max Tokens',
      icon: 'moon',
    })

    const topP = new NumberControl({
      dataKey: 'topP',
      name: 'Top P',
      icon: 'moon',
    })

    const frequencyPenalty = new NumberControl({
      dataKey: 'frequencyPenalty',
      name: 'Frequency Penalty',
      icon: 'moon',
    })

    const presencePenalty = new NumberControl({
      dataKey: 'presencePenalty',
      name: 'Presence Penalty',
      icon: 'moon',
    })

    const stop = new InputControl({
      dataKey: 'stop',
      name: 'Stop',
      icon: 'moon',
    })

    node.inspector
      .add(modelName)
      .add(temperature)
      .add(maxTokens)
      .add(topP)
      .add(frequencyPenalty)
      .add(presencePenalty)
      .add(stop)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  /*for text completion:
  const data = {
    "prompt": context,
    "temperature": 0.9,
    "max_tokens": 100,
    "top_p": 1,
    "frequency_penalty": dialogFrequencyPenality,
    "presence_penalty": dialogPresencePenality,
    "stop": ["\"\"\"", `${speaker}:`, '\n']
  };
  */

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0]

    const modelName = node?.data?.modelName as string
    const temperatureData = node?.data?.temperature as string
    const temperature = parseFloat(temperatureData)
    const maxTokensData = node?.data?.maxTokens as string
    const maxTokens = parseInt(maxTokensData)
    const topPData = node?.data?.topP as string
    const topP = parseFloat(topPData)
    const frequencyPenaltyData = node?.data?.frequencyPenalty as string
    const frequencyPenalty = parseFloat(frequencyPenaltyData)
    const presencePenaltyData = node?.data?.presencePenalty as string
    const presencePenalty = parseFloat(presencePenaltyData)
    const stop = node?.data?.stop as string

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/text_completion`,
      {
        params: {
          prompt: action,
          modelName: modelName,
          temperature: temperature,
          maxTokens: maxTokens,
          topP: topP,
          frequencyPenalty: frequencyPenalty,
          presencePenalty: presencePenalty,
          stop: stop,
        },
      }
    )

    const { success, choice } = resp.data

    return {
      output: success ? choice : '',
    }
  }
}
