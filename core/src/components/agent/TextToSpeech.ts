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
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

const info = 'Returns the input string as voice'

type WorkerReturn = {
  output: string
}

export class TextToSpeech extends ThothComponent<Promise<WorkerReturn>> {
  constructor() {
    super('Text to Speech')

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
    const characterInp = new Rete.Input('character', 'Character', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const outp = new Rete.Output('Voice', 'String', stringSocket)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addInput(characterInp)
      .addOutput(dataOutput)
      .addOutput(outp)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0]
    const character = inputs['character']?.[0] as string

    const url = await axios.get(
      `${process.env.REACT_APP_API_ROOT_URL}/speech_to_text`,
      {
        params: {
          text: action,
          character: character,
        },
      }
    )

    return {
      output: (url.data as any).path as string,
    }
  }
}
