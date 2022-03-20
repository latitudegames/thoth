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
import { FewshotControl } from '../../dataControls/FewshotControl'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'Summarize And Store Facts About Speaker'

const fewshot = ``

type InputReturn = {
  output: unknown
}

export class SummarizeAndStoreFactsAboutSpeaker extends ThothComponent<
  Promise<InputReturn>
> {
  constructor() {
    super('Summarize And Store Facts About Speaker')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.category = 'Agents'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    node.data.fewshot = fewshot

    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const inp = new Rete.Input('string', 'Input String', stringSocket)
    const factsOut = new Rete.Output('output', 'Facts', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addOutput(dataOutput)
      .addOutput(factsOut)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const speaker = inputs['speaker'][0] as string
    const agent = inputs['agent'][0] as string
    const action = inputs['string'][0]
    const prompt = node.data.fewshot as string

    const p = prompt
      .replace('\n\n', '\n')
      .replace('$speaker', speaker)
      .replace('$agent', agent)
      .replace('$example', action as string)

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/text_completion`,
      {
        params: {
          prompt: p,
          modelName: 'davinci',
          temperature: 0.3,
          maxTokens: 20,
          topP: 1,
          frequencyPenalty: 0.0,
          presencePenalty: 0.0,
          stop: ['"""', '\n'],
        },
      }
    )

    const { success, choice } = resp.data

    const result = success ? choice?.trim() : ''
    if (!silent) node.display(result)

    return {
      output: result,
    }
  }
}
