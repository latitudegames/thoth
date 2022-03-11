/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-inferrable-types */
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
import { triggerSocket, stringSocket, arraySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info =
  'Generate Context is used to generate the context for the text completion'

const fewshot = `$room 
$personality 
$monologue 
$needsAndMotivations 
$morals 
$ethics 
$facts 
$agentFacts 
$speakerFacts 
$exampleDialog 
$conversation 
$agent:`

type WorkerReturn = {
  output: string
}

export class GenerateContext extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Generate Context')

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
    node.data.fewshot = fewshot

    const conversationInput = new Rete.Input(
      'conversation',
      'Conversation',
      stringSocket
    )
    const keywordsInput = new Rete.Input('keywords', 'Keywords', arraySocket)
    const speakersFacts = new Rete.Input(
      'speakersFacts',
      'SpeakersFacts',
      stringSocket
    )
    const agentFacts = new Rete.Input('agentFacts', 'AgentFacts', stringSocket)
    const agentInput = new Rete.Input('agent', 'Agent', stringSocket)
    const speakerInput = new Rete.Input('speaker', 'Speaker', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(conversationInput)
      .addInput(keywordsInput)
      .addInput(speakersFacts)
      .addInput(agentFacts)
      .addInput(agentInput)
      .addInput(speakerInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(output)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const conversation = inputs['conversation'][0] as string
    const keywords = inputs['keywords'][0] as any[]
    const speakersFacts = inputs['speakersFacts'][0] as string
    const agentFacts = inputs['agentFacts'][0] as string
    const agent = JSON.parse(inputs['agent'][0] as string)
    const speaker = inputs['speaker'][0] as string

    const fewshot = node.data.fewshot as string

    let kdata = ''
    if (keywords.length > 0) {
      kdata = 'More context on the chat:\n'
      for (const k in keywords) {
        kdata +=
          'Q: ' +
          capitalizeFirstLetter(keywords[k].word) +
          '\nA: ' +
          keywords[k].info +
          '\n\n'
      }
      kdata += '\n'
    }

    const res = fewshot
      .replace(/$morals/g, agent.morals)
      .replace(/$personality/g, agent.perseonality)
      .replace(/$exampleDialog/g, agent.dialog)
      .replace(/$monologue/g, agent.monologue)
      .replace(/$facts/g, agent.facts)
      .replace(/$speakerFacts/g, speakersFacts)
      .replace(/$agentFacts/g, agentFacts)
      .replace(/$keywords/g, kdata)
      .replace(/$agent/g, agent.agent)
      .replace(/$speaker/g, speaker)
      .replace(/$conversation/g, conversation)

    return {
      output: res,
    }
  }
}

function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
