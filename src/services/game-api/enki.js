export const getEnkiPrompt = async (taskName) => {
    // const url = 'https://latitude-game-api.herokuapp.com'
    const url = "http://localhost:3000";
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
  
      console.log("response", response);
      const parsed = await response.json();
  
      console.log("parsed", parsed);
  
      return parsed;
    } catch (err) {
      console.log("fetch error", err);
    }
  };
  

  export const getEnkis = async () => {
    // const url = 'https://latitude-game-api.herokuapp.com'
    const url = "http://localhost:3000";
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
  
      console.log("response", response);
      const parsed = await response.json();
  
      console.log("parsed", parsed);
  
      return parsed;
    } catch (err) {
      console.log("fetch error", err);
    }
  };