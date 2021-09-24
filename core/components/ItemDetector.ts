import Rete from 'rete'

import { FewshotControl } from '../dataControls/FewshotControl'
import { EngineContext } from '../engine'
import { stringSocket, triggerSocket } from '../sockets'
import { ThothComponent } from '../thoth-component'
import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../types'
// For simplicity quests should be ONE thing not complete X and Y
const fewshot = `Given an action, detect the item which is taken.

Action, Item: pick up the goblet from the fountain, goblet
Action, Item: grab the axe from the tree stump, axe
Action, Item: lean down and grab the spear from the ground, spear
Action, Item: gather the valerian plant from the forest, valerian plant
Action, Item: get the necklace from the box, necklace
Action, Item: `

const info = `The item detector attempts to recognize what item in a give text string is being mentioned or used.  The input is a text string the output is a string of the object`

export class ItemTypeComponent extends ThothComponent {
  constructor() {
    // Name of the component
    super('Item Detector')

    this.task = {
      outputs: { detectedItem: 'output', trigger: 'option' },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    node.data.fewshot = fewshot
    const inp = new Rete.Input('string', 'Text', stringSocket)
    const out = new Rete.Output('detectedItem', 'Item Detected', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)

    const fewshotControl = new FewshotControl({})

    node.inspector.add(fewshotControl)

    return node
      .addInput(inp)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(out)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const { completion } = thoth
    const action = inputs['string'][0]
    const fewshot = node.data.fewshot as string
    const prompt = fewshot + action + ','

    const body = {
      prompt,
      stop: ['\n'],
      maxTokens: 100,
      temperature: 0.0,
    }
    const raw = (await completion(body)) as string
    const result = raw?.trim()
    if (!silent) node.display(result)

    return {
      detectedItem: result,
    }
  }
}
