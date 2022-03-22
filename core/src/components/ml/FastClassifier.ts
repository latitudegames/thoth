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
import { BooleanControl } from '../../dataControls/BooleanControl'
import { InputControl } from '../../dataControls/InputControl'
import { NumberControl } from '../../dataControls/NumberControl'
import { EngineContext } from '../../engine'
import { triggerSocket, stringSocket } from '../../sockets'
import { ThothComponent } from '../../thoth-component'

const info =
  'Complex String Matcher uses basic string matches to determine if the input matches some selected properties'

export class FastClassifier extends ThothComponent<Promise<void>> {
  constructor() {
    super('Complex String Matcher')

    this.task = {
      outputs: { true: 'option', false: 'option' },
    }

    this.category = 'Strings'
    this.display = true
    this.info = info
  }

  builder(node: ThothNode) {
    const nameControl = new InputControl({
      dataKey: 'name',
      name: 'Component Name',
    })

    // checkbox for [must match] and [dont match]

    // list of words to match beginning

    const matchBeginningString = new InputControl({
      dataKey: 'matchBeginningString',
      name: 'Match Beginning (, separated)',
    })

    const dontMatchBeginning = new BooleanControl({
      dataKey: 'dontMatchBeginning',
      name: 'Must Not Match',
      icon: 'moon',
    })

    const matchEndString = new InputControl({
      dataKey: 'matchEndString',
      name: 'Match End (, separated)',
    })

    const dontMatchEnd = new BooleanControl({
      dataKey: 'dontMatchEnd',
      name: 'Must Not Match',
      icon: 'moon',
    })

    const matchAnyString = new InputControl({
      dataKey: 'matchAnyString',
      name: 'Match Any (, separated)',
    })

    const dontMatchAny = new BooleanControl({
      dataKey: 'dontMatchAny',
      name: 'Must Not Match',
      icon: 'moon',
    })

    const stringMinLength = new NumberControl({
      dataKey: 'stringMinLength',
      name: 'Minimum String Length (0 to ignore)',
    })

    const stringMaxLength = new NumberControl({
      dataKey: 'stringMaxLength',
      name: 'Maximum String Length (0 to ignore)',
    })

    node.inspector
      .add(nameControl)
      .add(matchBeginningString)
      .add(dontMatchBeginning)
      .add(matchEndString)
      .add(dontMatchEnd)
      .add(matchAnyString)
      .add(dontMatchAny)
      .add(stringMinLength)
      .add(stringMaxLength)

    const inp = new Rete.Input('input', 'Input', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const isTrue = new Rete.Output('true', 'True', triggerSocket)
    const isFalse = new Rete.Output('false', 'False', triggerSocket)

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
    const input = (inputs['input'][0] as string)
      .replaceAll('"', '')
      .replaceAll("'", '')
      .replaceAll('<', '')
      .replaceAll('>', '')
      .toLowerCase()

    const dontMatchBeginning = node.data.dontMatchBeginning

    const dontMatchEnd = node.data.dontMatchEnd

    const dontMatchAny = node.data.dontMatchAny

    const stringMinLength = node.data.stringMinLength as number
    const stringMaxLength = node.data.stringMaxLength as number

    const matchBeginningStringArray = (node.data.matchBeginningString as string)
      .trim()
      .toLowerCase()
      .split(', ')

    const matchEndStringArray = (node.data.matchEndString as string)
      .trim()
      .toLowerCase()
      .split(', ')

    const matchAnyStringArray = (node.data.matchAnyString as string)
      .trim()
      .toLowerCase()
      .split(', ')

    let isMatched = false
    let invalidated = false

    function match(inp: string, matchArray: string[]) {
      for (const matchString of matchArray) {
        if (inp.startsWith(matchString)) {
          return true
        }
      }
      return false
    }

    if (stringMaxLength !== 0) {
      if (input.length > stringMaxLength || input.length < stringMinLength) {
        invalidated = true
      }
    }

    if (!invalidated && matchBeginningStringArray.length > 0) {
      const matched = match(input, matchBeginningStringArray)
      if (!dontMatchBeginning && matched) {
        // console.log('matched beginning')
        isMatched = true
      } else if (dontMatchBeginning && matched) {
        // console.log('NOT matched beginning')
        invalidated = true
      } else if (!dontMatchBeginning && !matched) {
        // console.log('beginning not matched out')
        isMatched = false
      } else if (dontMatchBeginning && !matched) {
        // console.log('beginning not matched out')
        isMatched = true
      }
    }
    if (!invalidated && matchEndStringArray.length > 0) {
      const matched = match(input, matchEndStringArray)
      if (!dontMatchEnd && matched) {
        // console.log('matched beginning')
        isMatched = true
      } else if (dontMatchEnd && matched) {
        // console.log('NOT matched beginning')
        invalidated = true
      } else if (!dontMatchEnd && !matched) {
        // console.log('beginning not matched out')
        isMatched = false
      } else if (dontMatchEnd && !matched) {
        // console.log('beginning not matched out')
        isMatched = true
      }
    }
    if (!invalidated && matchAnyStringArray.length > 0) {
      const matched = match(input, matchAnyStringArray)
      if (!dontMatchAny && matched) {
        // console.log('matched beginning')
        isMatched = true
      } else if (dontMatchAny && matched) {
        // console.log('NOT matched beginning')
        invalidated = true
      } else if (!dontMatchAny && !matched) {
        // console.log('beginning not matched out')
        isMatched = false
      } else if (dontMatchAny && !matched) {
        // console.log('beginning not matched out')
        isMatched = true
      }
    }

    this._task.closed = invalidated || !isMatched ? ['false'] : ['true']
  }
}
