export const completion = async (body) => {
  // const url = 'https://latitude-game-api.herokuapp.com'
  const url = process.env.REACT_APP_API_URL;
  try {
    const response = await fetch(url + "/openai", {
      method: "POST",
      prompt,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_GAME_KEY,
      },
      body: JSON.stringify(body),
    });

    const parsed = await response.text();

    return parsed;
  } catch (err) {
    console.log("fetch error", err);
  }
};
