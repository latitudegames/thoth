
export type ModelCompletionOpts = {
  model: string
  prompt?: string
  maxTokens?: number
  temperature?: number
  topP?: number
  n?: number
  stream?: boolean
  logprobs?: number
  echo?: boolean
  stop?: string | string[]
  presencePenalty?: number
  frequencyPenalty?: number
  bestOf?: number
  user?: string
  logitBias?: { [token: string]: number }
}

export type OpenAIResultChoice = {
  text: string,
  index: number,
  logprobs: number[],
  "top_logprobs": any[],
  "text_offset": number[]
}

export type  OpenAIResponse =  {
  id: string,
  object: string,
  created: number,
  model: string,
  choices: OpenAIResultChoice[]
  "finish_reason": string
}

export const completion = async (body: ModelCompletionOpts) => {
  const url = process.env.REACT_APP_API_URL;

  try {
    const response = await fetch(url + "/ml/text/completions", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_GAME_KEY || "",
      },
      body: JSON.stringify({ ...body, prompt: body.prompt?.trimEnd() }),
    });
    const parsedResponse = await response.json();
    const { result }:{result: OpenAIResultChoice | string} = parsedResponse;
    return result;
  } catch (err) {
    console.log("fetch error", err);
  }
};
