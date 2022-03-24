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
import { InputControl } from '../../dataControls/InputControl'
import { EngineContext } from '../../engine'
import { anySocket, stringSocket, triggerSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info = 'SentenceMatcher takes an query, needs to be generalized'

type InputReturn = {
  output: unknown
}

export class SentenceMatcher extends ThothComponent<Promise<InputReturn>> {
  constructor() {
    super('Sentence Matcher')

    this.task = {
      outputs: {
        trigger: 'option',
        output: 'output',
      },
    }

    this.category = 'AI/ML'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    const labelControl = new InputControl({
      dataKey: 'labels',
      name: 'Labels',
    })

    node.inspector.add(nameControl).add(labelControl)
    const sentences = new Rete.Input('sentences', 'Sentences', anySocket, true)
    const source = new Rete.Input('source', 'Source', anySocket, true)

    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const output = new Rete.Output('output', 'Output', stringSocket, true)

    return node
      .addOutput(output)
      .addOutput(dataOutput)
      .addInput(sentences)
      .addInput(source)
      .addInput(dataInput)
  }

  async worker(
    node: NodeData,
    inputs: ThothWorkerInputs,
    outputs: ThothWorkerOutputs,
    { silent, thoth }: { silent: boolean; thoth: EngineContext }
  ) {
    const sourceSentence = (inputs['source'][0] ?? inputs['source']) as string
    const sentences = (inputs['sentences'][0] ??
      inputs['sentences']) as string[]

    const query = {
      inputs: {
        source_sentence: sourceSentence,
        sentences: sentences,
      },
    }

    const resp = await axios.post(
      `${process.env.REACT_APP_API_URL}/hf_request`,
      query
    )

    const { data, success, error } = resp.data

    console.log('Response is', data)

    // get the index of the largest number in the data array
    const maxIndex = data.reduce(
      (iMax: number, x: number, i: number, arr: { [x: number]: number }) =>
        x > arr[iMax] ? i : iMax,
      0
    )

    console.log('maxIndex is', maxIndex)
    console.log('sentences[maxIndex] is', sentences[maxIndex])

    if (!silent) {
      if (!success) node.display(error)
      else node.display('Top label is ' + sentences[maxIndex])
    }
    console.log('Top label is ' + sentences[maxIndex])
    return { output: sentences[maxIndex] }
  }
}
