import vm2 from 'vm2'
import {
  EngineContext,
  ThothWorkerInputs,
} from '@latitudegames/thoth-core/dist/types'
import { completion } from './api/completion'
import { runSpell } from './api/spell'

export const buildThothInterface = (
  defaultState: Record<string, any>
): EngineContext => {
  // notes: need a way to replace state between runs?

  let gameState = {
    ...defaultState,
  }

  return {
    // would be good to get a proper type in here
    async completion(request: Record<string, any>) {
      const response = await completion(request)
      return response
    },
    getCurrentGameState: () => gameState,
    setCurrentGameState: (state: Record<string, any>) => {
      gameState = state
    },
    updateCurrentGameState: (update: Record<string, unknown>) => {
      const newState = {
        ...gameState,
        ...update,
      }
      gameState = newState
    },
    async enkiCompletion() {
      // Hit enki endpoint?
      return { outputs: [] }
    },
    async huggingface() {
      return {}
    },
    async runSpell(inputs: Record<string, any>, spellId: string) {
      return runSpell({ spellId, inputs })
    },
    async readFromImageCache() {
      return { images: [] }
    },
    processCode: (
      code: unknown,
      inputs: ThothWorkerInputs,
      data: Record<string, any>,
      state: Record<string, any>
    ) => {
      const { VM } = vm2

      const logValues: any[] = []

      const sandboxConsole = {
        log: (val: any, ...rest: any[]) => {
          if (rest.length) {
            logValues.push(JSON.stringify([val, ...rest], null, 2))
          } else {
            logValues.push(JSON.stringify(val, null, 2))
          }
        },
      }

      const flattenedInputs = Object.entries(
        inputs as ThothWorkerInputs
      ).reduce((acc, [key, value]) => {
        // eslint-disable-next-line prefer-destructuring
        acc[key as string] = value[0] // as any[][0] <- this change was made 2 days ago
        return acc
      }, {} as Record<string, any>)

      const vm = new VM()

      vm.protect(state, 'state')

      vm.freeze(flattenedInputs, 'input')
      vm.freeze(data, 'data')
      vm.freeze(sandboxConsole, 'console')

      const codeToRun = `"use strict"; function runFn(input,data,state){ const copyFn=${code}; return copyFn(input,data,state)}; runFn(input,data,state);`
      try {
        return vm.run(codeToRun)
      } catch (err) {
        console.log({ err })
        throw new Error('Error in runChain: processCode.')
      }
    },
  }
}
