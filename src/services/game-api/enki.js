const url = process.env.REACT_APP_API_URL;

export const getEnkiPrompt = async (taskName) => {
  try {
    const response = await fetch(url + `/enki/${taskName}`, {
      method: "GET",
      prompt,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_GAME_KEY,
      },
    });

    const parsed = await response.json();

    return parsed;
  } catch (err) {
    console.log("fetch error", err);
  }
};

export const getEnkis = async () => {
  try {
    const response = await fetch(url + `/enki`, {
      method: "GET",
      prompt,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_GAME_KEY,
      },
    });

    const parsed = await response.json();

    return parsed;
  } catch (err) {
    console.log("fetch error", err);
  }
};

export const postEnkiCompletion = async (taskName, inputs) => {
  try {
    const response = await fetch(url + `/enki/${taskName}/completion`, {
      method: "POST",
      prompt,
      mode: "cors",
      body: JSON.stringify({ inputs }),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_GAME_KEY,
      },
    });

    const parsed = await response.json();

    return parsed;
  } catch (err) {
    console.log("fetch error", err);
  }
};
