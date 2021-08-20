export const completion = async (body) => {
  const url = process.env.REACT_APP_API_URL;

  try {
    const response = await fetch(url + "/completions", {
      method: "POST",
      prompt,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_GAME_KEY,
      },
      body: JSON.stringify({ ...body, prompt: body.prompt.trimEnd() }),
    });

    const parsed = await response.text();

    return parsed;
  } catch (err) {
    console.log("fetch error", err);
  }
};
