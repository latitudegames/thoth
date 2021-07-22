import { useContext, createContext } from "react";

const state = {
  steps: [
    {
      target: ".startScreen_version-banner__2-Q0f",
      content: "Welcome to Thoth! Lets get started...",
    },
    {
      target: ".startScreen_button-row__2XZch",
      content: "Click here to compose your first spell",
    },
  ],
};

const Context = createContext({
  state,
});
export const useJoyride = () => useContext(Context);

const JoyrideProvider = ({ children }) => {
  const publicInterface = {
    state,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default JoyrideProvider;
