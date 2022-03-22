/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import Handlebars from 'handlebars'
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { SocketGeneratorControl } from '../../dataControls/SocketGenerator'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'
const info = `The generator component is our general purpose completion component.  You can define any number of inputs, and utilise those inputs in a templating language known as Handlebars.  Any value which is wrapped like {{this}} in double braces will be replaced with the corresponding value coming in to the input with the same name.  This allows you to write almost any fewshot you might need, and input values from anywhere else in your chain.
Controls have also been added which give you control of some of the fundamental settings of the OpenAI completion endpoint, including temperature, max tokens, and your stop sequence.
The componet has two returns.  The composed will output your entire fewshot plus the completion, whereas the result output will only be the result of the completion. `

type WorkerReturn = {
  result: string
  composed: string
}

export class Generator extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Generator')
    this.task = {
      outputs: {
        result: 'output',
        composed: 'output',
        trigger: 'option',
      },
    }
    this.category = 'AI/ML'
    this.info = info
  }

  builder(node: ThothNode) {
    const dataIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOut = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const resultOut = new Rete.Output('result', 'Result', stringSocket)
    const composedOut = new Rete.Output('composed', 'Composed', stringSocket)

    node
      .addInput(dataIn)
      .addOutput(dataOut)
      .addOutput(resultOut)
      .addOutput(composedOut)

    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    const inputGenerator = new SocketGeneratorControl({
      connectionType: 'input',
      name: 'Input Sockets',
      ignored: ['trigger'],
    })

    const fewshotControl = new FewshotControl({
      language: 'handlebars',
    })

    const stopControl = new InputControl({
      dataKey: 'stop',
      name: 'Stop',
      icon: 'stop-sign',
    })

    const temperatureControl = new InputControl({
      dataKey: 'temp',
      name: 'Temperature',
      icon: 'temperature',
    })

    const maxTokenControl = new InputControl({
      dataKey: 'maxTokens',
      name: 'Max Tokens',
      icon: 'moon',
    })

    const frequencyPenalty = new InputControl({
      dataKey: 'frequencyPenalty',
      name: 'Frequency Penalty',
    })

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(fewshotControl)
      .add(stopControl)
      .add(temperatureControl)
      .add(maxTokenControl)
      .add(frequencyPenalty)

    return node
  }

  async worker(
    node: NodeData,
    rawInputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    const fewshot = (node.data.fewshot as string) || ''
    const stopSequence = node.data.stop as string
    const template = Handlebars.compile(fewshot)
    const prompt = template(inputs)

    const stop = node?.data?.stop
      ? stopSequence.split(',').map(i => i.trim())
      : ['\n']

    const tempData = node.data.temp as string
    const temperature = tempData ? parseFloat(tempData) : 0.7
    const maxTokensData = node?.data?.maxTokens as string
    const maxTokens = maxTokensData ? parseInt(maxTokensData) : 50
    const frequencyPenaltyData = node?.data?.frequencyPenalty as string
    const frequencyPenalty = frequencyPenaltyData
      ? parseFloat(frequencyPenaltyData)
      : 0

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/text_completion`,
      {
        params: {
          prompt: prompt,
          modelName: 'davinci',
          temperature: temperature,
          maxTokens: maxTokens,
          frequencyPenalty: frequencyPenalty,
          stop: stop,
        },
      }
    )

    const { success, choice } = resp.data

    const result = success ? choice?.trim() : ''
    const composed = `${prompt} ${result}`

    return {
      result,
      composed,
    }
  }
}
