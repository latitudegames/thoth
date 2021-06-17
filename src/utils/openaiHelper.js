export const completion = async (body) => {
  console.log("body", body);
  try {
    const response = await fetch("http://localhost:8000/openai", {
      method: "POST",
      prompt,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_GAME_KEY,
      },
      body: JSON.stringify(body),
    });

    console.log("response", response);
    const parsed = await response.text();

    console.log("parsed", parsed);

    return parsed;
  } catch (err) {
    console.log("fetch error", err);
  }
};
