import { gen, sampleOne } from 'testcheck'

import { dbMock } from './dbMock'

const fewshotTask = dbMock.define('fewshotTask', {
  // TODO: determine if we have handle URL encoding correctly for task names
  name: sampleOne(gen.alphaNumString), // used in URL paths
  numInputs: sampleOne(gen.posInt),
  numOutputs: sampleOne(gen.posInt),
  unstuffedParentId: gen.oneOf([sampleOne(gen.int), null]),
})

const fewshotData = dbMock.define('fewshotTask', {
  fewshotTaskId: sampleOne(gen.int),
  inputs: sampleOne(gen.array(gen.string)),
  outputs: sampleOne(gen.array(gen.string)),
  creator: sampleOne(gen.oneOf([gen.int, null])), // TODO: foreign key should end in _id
  provenance: sampleOne(gen.oneOf(['manual', 'approved', 'logs', null])),
  tags: sampleOne(gen.oneOf([gen.array(gen.string), null])),
})

// TODO: Do we still need both tasks and serializations? Do we every use multiple serializations for a single task?
// TODO: If we do use multiple serializations for a single task, should numInputs and numOutputs live at the serialization level?
const fewshotSerialization = dbMock.define('fewshotTask', {
  fewshotTaskId: sampleOne(gen.int),
  name: sampleOne(gen.oneOf([gen.string, null])),
  isPreferred: sampleOne(gen.boolean),
  introduction: sampleOne(gen.string),
  beforeEachInput: sampleOne(gen.array(gen.string)),
  inBetween: sampleOne(gen.string),
  beforeEachOutput: sampleOne(gen.array(gen.string)),
  atTheEnd: sampleOne(gen.string),
})

export const creatorToolsDatabase = {
  fewshotTask,
  fewshotData,
  fewshotSerialization,
}
