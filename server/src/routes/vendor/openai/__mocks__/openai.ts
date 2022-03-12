import { gen, sampleOne } from 'testcheck'

export const openAiResult = {
  id: 'cmpl-3XdaR0ZMX335C5FzGornGby9ujTAz',
  object: 'text_completion',
  created: 1629146007,
  model: 'davinci:2020-05-03',
  choices: [
    {
      text: ' in the far reaches of the province of Yunnan, there was a very beautiful princess, and she had fallen hopelessly in love with a handsome young prince. Their love was so strong that they decided to get married. The only thing that stood between them was the fact that her parents refused to agree to the marriage. The princess had no choice but to run away with her lover. So the two lovers escaped to the west, where they lived happily ever after.”\n\n“That’s just a fairy tale.”\n\n“Well, it’s',
      index: 0,
      logprobs: null,
      finish_reason: 'length',
    },
  ],
  durationMs: 4618.170598998666,
}

export const complete = () => Promise.resolve(openAiResult)
export const modelComplete = () => Promise.resolve(openAiResult)

export const invokeModelModified = (params: {
  inputs: string[]
  n: number
}) => {
  return sampleOne(gen.array(gen.string, { size: params.n }))
}
