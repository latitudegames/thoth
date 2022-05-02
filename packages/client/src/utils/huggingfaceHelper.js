export const invokeInference = async (model, data) => {
  const API_TOKEN = process.env.REACT_APP_HUGGINGFACE_API_TOKEN

  const response = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      method: 'POST',
      body: JSON.stringify(data),
    }
  )
  const result = await response.json()
  return result
}
