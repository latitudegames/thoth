import Rete from 'rete'
// @seang todo: convert data controls to typescript to remove this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { v4 as uuidv4 } from 'uuid'

import { EditorContext, NodeData, ThothNode } from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { TaskOptions } from '../plugins/taskPlugin/task'
import { triggerSocket } from '../sockets'
import { ThothComponent, ThothTask } from '../thoth-component'
import { PlaytestControl } from '../dataControls/PlaytestControl'
import { SwitchControl } from '../dataControls/SwitchControl'
const info = `The trigger in allows you to pass values into your spell either from a higher level component or from the server.  There must be one single trigger into a spell for now as the server does not support multiple triggers.  Yet.`

export class TriggerIn extends ThothComponent<void> {
  task: TaskOptions
  category: string
  info: string
  contextMenuName: string
  nodeTaskMap: Record<number, ThothTask> = {}

  constructor() {
    // Name of the component
    // If name of component changes please update module-manager workerModule code
    super('Module Trigger In')
    this.displayName = 'Trigger In'
    this.contextMenuName = 'Trigger In'

    this.task = {
      outputs: {
        trigger: 'option',
      },
      init: (task: ThothTask, node: ThothNode) => {
        // store the nodes task inside the component
        this.nodeTaskMap[node.id] = task
      },
    }

    this.module = {
      nodeType: 'triggerIn',
      socket: triggerSocket,
    }

    this.category = 'I/O'

    this.info = info
  }

  subscriptionMap: Record<string, Function> = {}
  triggerSubscriptionMap: Record<string, Function> = {}

  unsubscribe?: () => void

  subscribeToPlaytest(node: ThothNode) {
    const { onPlaytest } = this.editor?.thoth as EditorContext

    // check node for the right data attribute
    if (onPlaytest) {
      // store the unsubscribe function in our node map
      this.subscriptionMap[node.id] = onPlaytest((text: string) => {
        // if the node doesnt have playtest toggled on, do nothing
        const playtestToggle = node.data.playtestToggle as unknown as {
          receivePlaytest: boolean
        }
        if (!playtestToggle.receivePlaytest) return

        const task = this.nodeTaskMap[node.id]

        // will need to run this here with the stater rather than the text
        task?.run(text)
        task?.reset()
        this.editor?.trigger('process')
      })
    }
  }

  subscribeToTrigger(node: ThothNode) {
    const { onTrigger } = this.editor?.thoth as EditorContext

    const callback = (value: string) => {
      const defaultNode = Object.entries(this.nodeTaskMap).map(
        (entry: Record<string, any>) => {
          if (entry[1].node.data.isDefaultTriggerIn) return parseInt(entry[0])
        }
      )
      const nodeId = defaultNode[0] ?? node.id
      const task = this.nodeTaskMap[nodeId]

      task?.run(value)
      task?.reset()
      this.editor?.trigger('process')
    }

    if (onTrigger) {
      this.triggerSubscriptionMap[node.id] = onTrigger(node, callback)
      this.triggerSubscriptionMap['default'] = onTrigger('default', callback)
    }
  }

  destroyed(node: ThothNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]
    if (this.triggerSubscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.triggerSubscriptionMap[node.id]
    if (this.triggerSubscriptionMap['default'])
      this.subscriptionMap['default']()
    delete this.triggerSubscriptionMap['default']
  }

  async run(node: ThothNode, data: NodeData) {
    const task = this.nodeTaskMap[node.id]
    try {
      await task.run(data)
    } catch (err: any) {
      throw err
    }
  }

  // the builder is used to "assemble" the node component.
  // when we have enki hooked up and have grabbed all few shots, we would use the builder
  // to generate the appropriate inputs and ouputs for the fewshot at build time
  builder(node: ThothNode) {
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.subscriptionMap[node.id]
    if (this.triggerSubscriptionMap[node.id]) this.subscriptionMap[node.id]()
    delete this.triggerSubscriptionMap[node.id]
    if (this.triggerSubscriptionMap['default'])
      this.subscriptionMap['default']()
    delete this.triggerSubscriptionMap['default']

    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output('trigger', 'Trigger', triggerSocket)

    node.data.socketKey = node?.data?.socketKey || uuidv4()
    node.data.name = node.data.name || `trigger-in-${node.id}`

    const nameInput = new InputControl({
      dataKey: 'name',
      name: 'Trigger name',
      defaultValue: node.data.name,
    })

    // subscribe the node to the playtest input data stream
    this.subscribeToPlaytest(node)
    this.subscribeToTrigger(node)

    const data = node?.data?.playtestToggle as
      | {
          receivePlaytest: boolean
        }
      | undefined

    const togglePlaytest = new PlaytestControl({
      dataKey: 'playtestToggle',
      name: 'Receive from playtest input',
      defaultValue: {
        receivePlaytest:
          data?.receivePlaytest !== undefined ? data?.receivePlaytest : true,
      },
      ignored: ['output'],
      label: 'Receive from playtest',
    })

    const toggleDefault = new SwitchControl({
      dataKey: 'isDefaultTriggerIn',
      name: 'Make Default TriggerIn',
      label: 'Make Default TriggerIn',
      defaultValue: false,
    })

    node.inspector.add(nameInput).add(togglePlaytest).add(toggleDefault)

    return node.addOutput(out)
  }

  worker() {
    return {}
  }
}
