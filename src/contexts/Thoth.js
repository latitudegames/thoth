import { useContext, createContext, useState } from "react";

const Context = createContext({
  currentSpell: {},
  setCurrentSpell: {},
});

export const useThoth = () => useContext(Context);

const ThothProvider = ({ children }) => {
  const [currentSpell, setCurrentSpell] = useState({});

  const publicInterface = {
    currentSpell,
    setCurrentSpell,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default ThothProvider;
