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

const info = `The VisualGeneration component is used to access the image cache. You pass it a caption, a cacheTag and an optional topK value and it returns an array of images that are related to your caption. 

caption- is a string related to what type of image you want to search for.

cacheTag- {insert cacheTag description here}. 

topK- number of (k) matches for a particular description. IE: if you submit as a caption: "castle" and k was 5, it would return a fortress, a keep, a battlement, a gatehouse, and a tower. The k=5 images most similar to the word "castle`

export type ImageType = {
  id: string
  captionId: string
  imageCaption: string
  imageUrl: string
  tag: string
  score: number | string
}

