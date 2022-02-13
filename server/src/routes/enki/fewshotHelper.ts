/* eslint-disable no-console */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statement */
import { fewshotData } from '../../databases/models/fewshotData'
import { fewshotSerialization } from '../../databases/models/fewshotSerialization'

// interface FewshotTask {
//   name: string;
//   num_inputs: number;
//   num_outputs: number;
//   unstuffed_parent: FewshotTask | undefined;
// }

// interface FewshotData {
//   inputs: string[]
//   outputs: string[]
// }

type FewshotSerialization = {
  name?: string
  isPreferred?: boolean
  introduction: string
  beforeEachInput: string[]
  inBetween: string
  beforeEachOutput: string[]
  atTheEnd: string
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

type ExtractionResult = {
  results: string[]
  position: number
}

export const getPreamble = (
  data: fewshotData[],
  serialization: fewshotSerialization
) => {
  if (!serialization) return
  const parts: string[] = []
  parts.push(serialization.introduction)
  for (const d of data) {
    for (let i = 0; i < d.inputs.length; ++i) {
      parts.push(
        serialization.beforeEachInput?.length > i
          ? serialization.beforeEachInput[i]
          : ''
      )
      parts.push(d.inputs[i])
    }
    parts.push(serialization.inBetween)
    for (let i = 0; i < d.outputs.length; ++i) {
      parts.push(
        serialization.beforeEachOutput?.length > i
          ? serialization.beforeEachOutput[i]
          : ''
      )
      parts.push(d.outputs[i])
    }
    parts.push(serialization.atTheEnd)
  }
  return parts.join('')
}

export const getPrompt = (
  inputs: string[],
  data: fewshotData[],
  serialization: fewshotSerialization
) => {
  const parts = [getPreamble(data, serialization)]
  for (let i = 0; i < inputs.length; ++i) {
    parts.push(
      serialization.beforeEachInput?.length > i
        ? serialization.beforeEachInput[i]
        : ''
    )
    parts.push(inputs[i])
  }
  parts.push(serialization.inBetween)
  return parts.join('')
}

/**
 * Extraction code for finding the text interleaved between sentinels in a prefix
 *
 * Inputs:
 *  text : a source text to extract results from
 *  sentinels: a list of sentinels S1,S2,...,SN
 *
 * Returns:
 *  the strings R1,R2,RN-1 if text is of the form S1 R1 S2 R2...RN-1 SN XX, null otherwise.
 *  on success the string index at the beginning of SN is also returned, for chaining.
 */
const extractUsingSentinels = (
  text: string,
  sentinels: string[],
  startPosition: number
): ExtractionResult | null => {
  const results: string[] = []
  const numSentinels = sentinels?.length
  if (sentinels?.length < 2) {
    console.log('Extract using sentinels called with less than 2 sentinels', {
      text,
      sentinels,
      startPosition,
    })
    return null
  }
  // Must start with first sentinel.
  if (
    sentinels[0].length > 0 &&
    text.indexOf(sentinels[0], startPosition) !== startPosition
  ) {
    console.log('Sentinel 0 not found: ', { text, sentinels, startPosition })
    return null
  }
  let position = startPosition
  for (
    let sentinelIndex = 0;
    sentinelIndex < numSentinels - 1;
    ++sentinelIndex
  ) {
    position += sentinels[sentinelIndex].length
    const nextSentinel = sentinels[sentinelIndex + 1]
    const nextSentinelIndex = text.indexOf(nextSentinel, position)
    if (nextSentinelIndex === -1) {
      console.log('Sentinel not found: ', {
        text,
        sentinels,
        startPosition,
        sentinelIndex,
      })
      return null
    }
    results.push(text.substr(position, nextSentinelIndex - position))
    position = nextSentinelIndex
  }
  return { results, position }
}

export const extractOutput = ({
  text,
  serialization,
}: {
  text: string
  serialization: FewshotSerialization
}): string[] | null => {
  const xResult = extractUsingSentinels(
    text,
    serialization.beforeEachOutput?.concat([serialization.atTheEnd]),
    0
  )
  return xResult ? xResult.results : null
}

// const extractDatum = (
//   data: FewshotData[],
//   serialization: FewshotSerialization,
//   text: string
// ): FewshotData | null => {
//   const inputResult = extractUsingSentinels(
//     data,
//     serialization,
//     text,
//     serialization.beforeEachInput.concat([serialization.inBetween]),
//     0
//   );
//   if (inputResult) {
//     const outputResult = extractUsingSentinels(
//       data,
//       serialization,
//       text,
//       [serialization.inBetween].concat(
//         serialization.beforeEachOutput.concat([serialization.atTheEnd])
//       ),
//       inputResult.position
//     );
//     return outputResult
//       ? { inputs: inputResult.results, outputs: outputResult.results.slice(1) }
//       : null;
//   }
//   return null;
// };
