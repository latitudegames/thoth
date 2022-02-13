/* eslint-disable no-console */
/* eslint camelcase: 0 */

import { ForefrontCompletionResponse } from '../routes/vendor/forefront/forefront'

// OpenAI response type

export type Logprobs = {
  tokens: string[]
  token_logprobs: (number | null)[]
  top_logprobs: (Counterfactual | null)[] | null
  text_offset: number[]
}

export type OpenAICompletion = {
  text: string
  index: number
  logprobs: Logprobs
  finish_reason: string
}

export type OpenAIModelResponse = {
  id: string
  object: string
  created: number
  model: string
  choices: OpenAICompletion[]
  durationMs: number
  modelRequestId: string
}

// GPT-J response type

export type GPTJModelResponse = {
  predictions: string[]
  durationMs: number
  modelRequestId: string
}

// Huggingface response type
export type HuggingfaceModelResponse = {
  result: any
  durationMs: number
  modelRequestId: string
}

// AI21 model response type

export type AI21GeneratedToken = {
  token: string
  logprob: number
}

export type AI21TopToken = {
  token: string
  logprob: number
}

export type AI21TokenPosition = {
  generatedToken: AI21GeneratedToken
  topTokens: AI21TopToken[] | null
  textRange: Position
}

export type AI21Data = {
  text: string
  tokens: AI21TokenPosition[]
}

export type AI21FinishReason = {
  reason: string
  length?: number
}

export type AI21Completion = {
  data: AI21Data
  finishReason: AI21FinishReason
}

export type AI21ModelResponse = {
  id: string
  prompt: AI21Data
  completions: AI21Completion[]
  durationMs: number
  modelRequestId: string
}

// Universal model response type

export type Counterfactual = {
  [key: string]: number
}

export type GeneratedToken = {
  token: string
  logprob: number | null
  counterfactuals: Counterfactual | null
}

export type Position = {
  start: number
  end: number
}

export type TokenPosition = {
  generatedToken: GeneratedToken
  position: Position
}

export type Completion = {
  text: string
  tokens?: TokenPosition[] | null
  finishReason?: string | null
}

export type Prompt = {
  text: string
  tokens?: TokenPosition[] | null
  promptEndIndex: number | null
}

export type UniversalModelResponse = {
  completions: Completion[]
  prompt: Prompt
  id: string
  model: string
}

// OpenAI transformers

const openAITokenPosition = (token: string, textOffset: number) => {
  return {
    start: textOffset,
    end: textOffset + token.length,
  }
}

const formatOpenAITokenDict = (
  completion: OpenAICompletion,
  token: string,
  i: number
): TokenPosition => {
  const tokenDict = {
    generatedToken: {
      token: token,
      logprob: completion.logprobs.token_logprobs[i],
      counterfactuals: completion.logprobs.top_logprobs
        ? completion.logprobs.top_logprobs[i]
          ? completion.logprobs.top_logprobs[i]
          : null
        : null,
    },
    position: openAITokenPosition(token, completion.logprobs.text_offset[i]),
  }
  return tokenDict
}

const formatOpenAICompletion = (
  completion: OpenAICompletion,
  prompt: string,
  prompt_end_index: number
) => {
  if (completion.logprobs === null) {
    return {
      text: completion.text.slice(prompt.length),
      finishReason: completion.finish_reason,
    }
  }
  const completionDict = {
    text: completion.text.slice(prompt.length),
    finishReason: completion.finish_reason,
    tokens: [] as TokenPosition[],
  }
  completion.logprobs.tokens.forEach((token, i) => {
    const j = i + prompt_end_index
    if (j < completion.logprobs.tokens.length) {
      const tokenDict = formatOpenAITokenDict(
        completion,
        completion.logprobs.tokens[j],
        j
      )
      completionDict.tokens.push(tokenDict)
    }
  })

  return completionDict
}

const formatOpenAIPrompt = (completion: OpenAICompletion, prompt: string) => {
  // add tokens whose offsets are < prompt length
  if (completion.logprobs === null) {
    return {
      text: prompt,
      promptEndIndex: null,
    }
  }
  const tokens = completion.logprobs.tokens
  const promptDict = tokens.reduce(
    (promptAcc, token, i) => {
      if (completion.logprobs.text_offset[i] < prompt.length) {
        const tokenDict = formatOpenAITokenDict(completion, token, i)
        promptAcc.tokens.push(tokenDict)
        promptAcc.promptEndIndex = i
      }
      return promptAcc
    },
    { text: prompt, tokens: [] } as {
      text: string
      tokens: TokenPosition[]
      promptEndIndex?: number
    }
  )
  return promptDict
}

export const formatOpenAIResponse = (
  response: OpenAIModelResponse,
  prompt: string,
  echo: boolean = false
) => {
  const promptDict = echo
    ? formatOpenAIPrompt(response.choices[0], prompt)
    : { promptDict: { text: prompt, tokens: null }, promptEndIndex: 0 }
  const responseDict = {
    completions: response.choices.map(completion =>
      formatOpenAICompletion(
        completion,
        echo ? prompt : '',
        echo ? (promptDict.promptEndIndex as number) + 1 : 0
      )
    ),
    prompt: promptDict,
    id: response.id,
    model: response.model,
    durationMs: response.durationMs,
    modelRequestId: response.modelRequestId,
  }
  return responseDict
}

// AI21 transformers

const fixAi21Tokens = (token: string) => {
  return token.replace('▁', ' ').replace('<|newline|>', '\n')
}

const ai21TokenPosition = (textRange: Position, text_offset: number) => {
  return {
    start: textRange.start + text_offset,
    end: textRange.end + text_offset,
  }
}

const formatAi21TokenDict = (
  AI21tokenDict: AI21TokenPosition,
  prompt_offset = 0
) => {
  const tokenDict = {
    generatedToken: {
      token: fixAi21Tokens(AI21tokenDict.generatedToken.token),
      logprob: AI21tokenDict.generatedToken.logprob,
    },
    position: ai21TokenPosition(AI21tokenDict.textRange, prompt_offset),
    counterfactuals: AI21tokenDict.topTokens
      ? AI21tokenDict.topTokens.reduce((acc, c) => {
          acc[fixAi21Tokens(c.token)] = c.logprob
          return acc
        }, {} as Counterfactual)
      : null,
  }
  return tokenDict
}

const formatAi21Completion = (
  completion: AI21Completion,
  prompt_offset: number = 0
) => {
  const completionDict = {
    text: completion.data.text,
    tokens: completion.data.tokens.map((tokenDict: AI21TokenPosition) =>
      formatAi21TokenDict(tokenDict, prompt_offset)
    ),
    finishReason: completion.finishReason.reason,
  }
  return completionDict
}

export const formatAi21Response = (
  response: AI21ModelResponse,
  model: string
) => {
  const prompt = response.prompt.text
  const responseDict = {
    completions: response.completions.map(completion =>
      formatAi21Completion(completion, prompt.length)
    ),
    prompt: {
      text: prompt,
      tokens: response.prompt.tokens.map(token =>
        formatAi21TokenDict(token, 0)
      ),
      promptEndIndex: response.prompt.tokens.length,
    },
    id: response.id,
    model,
    durationMs: response.durationMs,
    modelRequestId: response.modelRequestId,
  }
  return responseDict
}

// Huggingface
export const formatHuggingfaceResponse = (
  response: HuggingfaceModelResponse,
  model: string
) => {
  const responseDict = {
    completions: response.result,
    prompt: '',
    id: null,
    model,
    durationMs: response.durationMs,
    modelRequestId: response.modelRequestId,
  }
  return responseDict
}

// GPT-J transformers

export const formatGPTJResponse = (
  response: GPTJModelResponse,
  prompt: string
) => {
  //const responseText = response.prediction.slice(prompt.length)
  const responseDict = {
    completions: response.predictions.map(prediction => {
      return {
        text: prediction.slice(prompt.length),
        tokens: null,
        finishReason: null,
      }
    }),
    prompt: { text: prompt, tokens: null, promptEndIndex: null },
    id: null,
    model: 'gpt-j',
    durationMs: response.durationMs,
    modelRequestId: response.modelRequestId,
  }
  return responseDict
}

export const formatForefrontResponse = (
  response: ForefrontCompletionResponse,
  model: string
) => {
  return {
    // TODO (mitchg) - Forefront currently does not return tokens or finish reason
    completions: response.result.map(completion => ({
      text: completion.completion.slice(response.prompt.length),
      tokens: null,
      finishResason: null,
    })),
    prompt: {
      text: response.prompt,
      tokens: null,
      promptEndIndex: null,
    },
    id: response.modelRequestId,
    model,
    durationMs: response.durationMs,
    modelRequestId: response.modelRequestId,
  }
}
