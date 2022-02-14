/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { FewshotControl } from '../dataControls/FewshotControl'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket, anySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'Facts Recall is used to get facts for an agent and user'

const fewshot = ``

type InputReturn = {
  output: unknown
  facts: unknown
}

export class SummarizeAndStoreFactsAboutSpeaker extends ThothComponent<
  Promise<InputReturn>
> {
  constructor() {
    super('Summarize And Store Facts About Speaker')

    this.task = {
      outputs: {
        output: 'output',
        facts: 'output',
        trigger: 'option',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    node.data.fewshot = fewshot

    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const out = new Rete.Output('output', 'Input String', anySocket)
    const inp = new Rete.Input('string', 'Input String', stringSocket)
    const factsOut = new Rete.Output('facts', 'Output', stringSocket)
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
      .addOutput(out)
      .addOutput(factsOut)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { completion } = thoth
    const speaker = inputs['speaker'][0] as string
    const agent = inputs['agent'][0] as string
    const action = inputs['string'][0]
    const prompt = node.data.fewshot as string

    const p = prompt
      .replace('\n\n', '\n')
      .replace('$speaker', speaker)
      .replace('$agent', agent)
      .replace('$example', action as string)

    const body = {
      p,
      temperature: 0.3,
      max_tokens: 20,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ['"""', '\n'],
    }
    const raw = (await completion(body)) as string
    const result = raw?.trim()
    if (!silent) node.display(result)

    return {
      output: action as string,
      facts: result,
    }
  }
}
