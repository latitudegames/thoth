import Handlebars from 'handlebars'
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { FewshotControl } from '../dataControls/FewshotControl'
import { InputControl } from '../dataControls/InputControl'
import { SocketGeneratorControl } from '../dataControls/SocketGenerator'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket } from '../sockets'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { ThothComponent } from '../thoth-component'
const info = `The generator component is our general purpose completion component.  You can define any number of inputs, and utilise those inputs in a templating language known as Handlebars.  Any value which is wrapped like {{this}} in double braces will be replaced with the corresponding value coming in to the input with the same name.  This allows you to write almost any fewshot you might need, and input values from anywhere else in your chain.

Controls have also been added which give you control of some of the fundamental settings of the OpenAI completion endpoint, including temperature, max tokens, and your stop sequence.

The componet has two returns.  The composed will output your entire fewshot plus the completion, whereas the result output will only be the result of the completion. `

export class Generator extends ThothComponent {
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
    const dataIn = new Rete.Input('trigger', 'Trigger', triggerSocket)
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

    node.inspector
      .add(nameControl)
      .add(inputGenerator)
      .add(fewshotControl)
      .add(stopControl)
      .add(temperatureControl)
      .add(maxTokenControl)

    return node
  }

  async worker(
    node: NodeData,
    rawInputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { completion } = thoth
    const inputs = Object.entries(rawInputs).reduce((acc, [key, value]) => {
      acc[key] = value[0]
      return acc
    }, {} as Record<string, unknown>)

    const fewshot = (node.data.fewshot as string) || ''
    const stopSequence = node.data.stop as string
    const temp = node.data.temp as string
    const maxTokensData = node?.data?.maxTokens as string
    const template = Handlebars.compile(fewshot)
    const prompt = template(inputs)

    const stop = node?.data?.stop
      ? stopSequence.split(',').map(i => i.trim())
      : ['/n']

    const temperature = node?.data?.temp ? parseFloat(temp) : 0.7
    const maxTokens = maxTokensData ? parseInt(maxTokensData) : 50

    const body = {
      prompt,
      stop,
      maxTokens,
      temperature,
    }
    const raw = (await completion(body)) as string
    const result = raw?.trim()

    const composed = `${prompt} ${result}`

    return {
      result,
      composed,
    }
  }
}
