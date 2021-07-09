import { useContext, createContext } from "react";
import { useDB } from "react-pouchdb";

const Context = createContext({
  getLayout: () => {},
  setLayout: () => {},
  currentLayout: "",
});

export const useLayout = () => useContext(Context);

const LayoutProvider = ({ children }) => {
  const db = useDB();

  const getLayout = async (tab) => {
    const layout = await db.get(`layout:${tab}`);
    return layout;
  };

  const setLayout = async (layout) => {
    try {
      const savedLayout = await db.put(layout);
      return savedLayout;
    } catch (err) {
      console.error("Error setting layout", err);
      return undefined;
    }
  };

  const publicInterface = {
    getLayout,
    setLayout,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default LayoutProvider;
