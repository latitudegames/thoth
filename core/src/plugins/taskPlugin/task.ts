import { NodeData } from 'rete/types/core/data'

import { ThothReteInput, ThothWorkerInputs } from '../../../types'
import { ThothComponent, ThothTask } from '../../thoth-component'

type TaskRef = {
  key: string
  task: ThothTask
  run?: Function
  next?: any[]
}

export type TaskOptions = {
  outputs: Record<string, unknown>
  init?: Function
  onRun?: Function
}

type RunOptions = {
  propagate?: boolean
  needReset?: boolean
  garbage?: Task[]
  fromSocket?: string
}

export type TaskOutputTypes = 'option' | 'output'

export class Task {
  node: NodeData
  inputs: ThothWorkerInputs
  component: ThothComponent
  worker: Function
  next: TaskRef[]
  outputData: Record<string, unknown> | null
  closed: string[]

  constructor(
    inputs: ThothWorkerInputs,
    component: ThothComponent,
    node: NodeData,
    worker: Function
  ) {
    this.node = node
    this.inputs = inputs as ThothWorkerInputs
    this.component = component
    this.worker = worker
    this.next = []
    this.outputData = null
    this.closed = []

    this.getInputs('option').forEach((key: string) => {
      this.inputs[key].forEach((workerInput: ThothReteInput) => {
        workerInput.task.next.push({ key: workerInput.key, task: this })
      })
    })
  }

  getInputs(type: TaskOutputTypes): string[] {
    return Object.keys(this.inputs)
      .filter(key => this.inputs[key][0])
      .filter(key => {
        const workerBase = this.inputs[key][0] as ThothReteInput
        return workerBase.type === type
      })
  }

  getInputFromConnection(socketKey: string) {
    let input: null | any = null
    Object.entries(this.inputs).forEach(([key, value]) => {
      if (value.some((con: ThothReteInput) => con && con.key === socketKey)) {
        input = key
      }
    })

    return input
  }

  reset() {
    this.outputData = null
  }

  async run(data: unknown = {}, options: RunOptions = {}) {
    const {
      needReset = true,
      garbage = [] as Task[],
      propagate = true,
      fromSocket,
    } = options

    if (needReset) garbage.push(this)

    // This would be a great place to run an animation showing the signal flow.
    // Just needto figure out how to change the folow of the connection attached to a socket on the fly.
    // And animations should follow the flow of the data, not the main IO paths

    if (!this.outputData) {
      const inputs = {} as Record<string, unknown[]>

      /*
        This is where we are populating all the input values to be passed into the worker.
        We are getting all the input connections that are connected as outputs (ie have values)
        We filter out all connections which did not come from the previou node.  This is to hgelp support multiple
        inputs properly, otherwise we actually back propagate along every input and run it, whichI think is unwanted behaviour.
        After we have filtered these out, we need to run the task, which triggers that nodes worker.  After the worker runs,
        the task has populated output data, which we take and we associate with the tasks input values, which are subsequently
        passed to the nodes worker for processing.

        We assume here that his nodes worker does not need to access ALL values simultaneously, but is only interested in one.
        There is a task option which enables this functionality just in case we have use cases that don't want this behaviour.
      */
      await Promise.all(
        this.getInputs('output').map(async key => {
          const thothWorkerinputs = await Promise.all(
            this.inputs[key].map(async (con: ThothReteInput) => {
              await con.task.run(data, {
                needReset: false,
                garbage,
                propagate: false,
              })
              const outputData = con.task.outputData as Record<string, unknown>
              return outputData[con.key]
            })
          )

          inputs[key] = thothWorkerinputs
        })
      )

      const socketInfo = {
        target: fromSocket ? this.getInputFromConnection(fromSocket) : null,
      }

      this.outputData = await this.worker(this, inputs, data, socketInfo)

      if (this.component.task.onRun)
        this.component.task.onRun(this.node, this, data, socketInfo)

      if (propagate)
        await Promise.all(
          this.next
            .filter(con => !this.closed.includes(con.key))
            // pass the socket that is being calledikno
            .map(async con => {
              return await con.task.run(data, {
                needReset: false,
                garbage,
                fromSocket: con.key,
              })
            })
        )
    }

    if (needReset) garbage.map(t => t.reset())
  }

  clone(root = true, oldTask: ThothTask, newTask: ThothTask) {
    const inputs = Object.assign({}, this.inputs) as ThothWorkerInputs

    if (root)
      // prevent of adding this task to `next` property of predecessor
      this.getInputs('option').map(key => delete inputs[key])
    // replace old tasks with new copies
    else
      Object.keys(inputs).forEach((key: string) => {
        inputs[key] = inputs[key].map((con: ThothReteInput) => ({
          ...con,
          task: con.task === oldTask ? newTask : (con.task as ThothTask),
        }))
      })

    const task = new Task(inputs, this.component, this.node, this.worker)

    // manually add a copies of follow tasks
    task.next = this.next.map(n => ({
      key: n.key,
      task: n.task.clone(false, this, task),
    }))

    return task
  }
}
