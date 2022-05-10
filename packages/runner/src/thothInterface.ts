import vm2 from 'vm2'
import {
  EngineContext,
  ThothWorkerInputs,
} from '@latitudegames/thoth-core/dist/types'

export const buildThothInterface = (): EngineContext => {
  // notes: need a way to replace state between runs?

  return {
    async completion(body) {
      // Call latitude completion endpoint
      return 'testing'
    },
    setCurrentGameState() {
      // set closure state?
    },
    getCurrentGameState() {
      // resturn closure state
      return {}
    },
    async enkiCompletion() {
      // Hit enki endpoint?
      return { outputs: [] }
    },
    updateCurrentGameState() {},
    async huggingface() {
      return {}
    },
    async runSpell() {
      return {}
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
