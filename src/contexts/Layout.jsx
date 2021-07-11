import { useContext, createContext, useEffect, useState } from "react";
import { usePubSub } from "./PubSub";
// import { useDB } from "./Database";

const Context = createContext({
  inspectorData: {},
  textEditorData: {},
  setCurrentMode: {},
  saveInspector: () => {},
  saveTextEditor: () => {},
  addTextEditor: () => {},
  addInspector: () => {},
  addStateManager: () => {},
  addPlaytest: () => {},
});

export const useLayout = () => useContext(Context);

const LayoutProvider = ({ children }) => {
  const { subscribe, publish, events } = usePubSub();

  const [currentModel, setCurrentModel] = useState({});
  const [inspectorData, setInspectorData] = useState({});
  const [textEditorData, setTextEditorData] = useState({});

  useEffect(() => {
    subscribe(events.INSPECTOR_SET, (event, data) => {
      setInspectorData(data);

      Object.entries(data.dataControls).forEach(([key, control]) => {
        if (control.component === "longText") {
          const dataSend = {
            data: data.data[key],
            nodeId: data.nodeId,
            key: data.name,
            name: data.name,
          };

          publish(events.TEXT_EDITOR_SET, dataSend);
        }
      });
    });

    subscribe(events.TEXT_EDITOR_SET, (event, data) => {
      setTextEditorData(data);
    });
  }, [events, subscribe, publish]);

  const saveTextEditor = (data) => {
    const dataSend = {
      [data.key]: data.data,
    };

    publish(events.NODE_SET(data.nodeId), dataSend);

    // Keep the inspector in sync with the text editor if needed.
    if (inspectorData[data.key]) {
      setInspectorData({
        ...inspectorData,
        ...dataSend,
      });
    }
  };

  const publicInterface = {
    inspectorData,
    textEditorData,
    saveTextEditor,
    setCurrentModel,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export const Layout = ({ model, factory }) => {
  // const { setCurrentModel } = useLayout();

  // useEffect(() => {
  //   setCurrentModel(model);
  // }, [model, setCurrentModel]);

  return <Layout model={model} factory={factory} />;
};

export default LayoutProvider;
