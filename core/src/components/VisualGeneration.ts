import Rete from 'rete'
import {
  NodeData,
  ThothNode,
  ThothWorkerInputs,
  ThothWorkerOutputs,
} from '../../types'
import { InputControl } from '../dataControls/InputControl'
import { EngineContext } from '../engine'
import { triggerSocket, stringSocket, arraySocket } from '../sockets'
import { ThothComponent } from '../thoth-component'

