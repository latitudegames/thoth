/* eslint-disable no-console */
/* eslint-disable require-await */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Rete from 'rete'

import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../../types'
import { FewshotControl } from '../../dataControls/FewshotControl'
import { InputControl } from '../../dataControls/InputControl'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

/* eslint-disable no-param-reassign */
function detectFastGreeting(input: string, maxLength: number, data: string) {
  input = input.toLowerCase().trim()
  if (input.length > maxLength) {
    return false
  }

  let fastGreetings = data.split('\n')
  fastGreetings = fastGreetings.filter(element => {
    return element !== ''
  })

  for (let i = 0; i < fastGreetings.length; i++) {
    if (input.includes(fastGreetings[i])) {
      return true
    }
  }

  return false
}

const info =
  'Fast Greeting Detector can detect whether or not a phrase is a greeting'

const fewshot = `hi
hey
supp
sup
hello
how are you
hey man
hey dude
hows it going
how's it going
whats up
what's up
whats going on
what's going on
hows everything
how's everything
how are things
hows life
how's life
hows your day
how's your day
long time now see
its been a while
it's been a while
good morning
good afternoon
its nice to meet you
it's nice to meet you
its nice to meet you
it's nice to meet you
its nice to be here
it's nice to be here
its nice to be here
it's nice to be here
yo
howdy`

export class FastGreetingDetector extends ThothComponent<Promise<void>> {
  constructor() {
    super('Fast Greeting Detector')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }

    this.category = 'Conversation'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    node.data.fewshot = fewshot

    const inp = new Rete.Input('string', 'String', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

    const maxLength = new InputControl({
      dataKey: 'maxLength',
      name: 'Max Length',
      icon: 'moon',
    })

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl).add(maxLength)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(isTrue)
      .addOutput(isFalse)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const action = inputs['string'][0]
    const fewshot = node.data.fewshot
    const maxLengthData = node?.data?.maxLength as string
    const maxLength = maxLengthData ? parseInt(maxLengthData) : 10

    const isQuestion = (action as string).toLowerCase().endsWith('?')
    const is =
      !isQuestion &&
      detectFastGreeting(action as string, maxLength, fewshot as string)

    this._task.closed = is ? ['false'] : ['true']
  }
}
