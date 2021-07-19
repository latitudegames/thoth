import { useContext, createContext, useEffect, useState, useRef } from "react";
import {
  Layout as LayoutComponent,
  Model,
  Actions,
  DockLocation,
  TabNode,
  TabSetNode,
} from "flexlayout-react";
import { usePubSub } from "./PubSubProvider";
import LoadingScreen from "../features/common/LoadingScreen/LoadingScreen";

// Component types are listed here which are used to load components from the data sent by rete
const componentTypes = {
  TEXT_EDITOR: "textEditor",
  INSPECTOR: "inspector",
  STATE_MANAGER: "stateManager",
  EDITOR: "editor",
  PLAYTEST: "playtest",
};

// helpful resources
// https://github.com/edemaine/comingle/blob/726d42e975307beb5281fddbf576591c36c1022d/client/Room.coffee#L365-L384
// https://github.com/caplin/FlexLayout/blob/master/examples/demo/App.tsx

const Context = createContext({
  inspectorData: {},
  textEditorData: {},
  createModel: () => {},
  currentModel: {},
  currentRef: {},
  setCurrentRef: () => {},
  saveInspector: () => {},
  saveTextEditor: () => {},
  createOrFocus: () => {},
  addWindow: () => {},
  componentTypes: {},
  workspaceMap: {},
  getWorkspace: () => {},
});

export const useLayout = () => useContext(Context);

const LayoutProvider = ({ children }) => {
  const { subscribe, publish, events } = usePubSub();

  const [currentModel, setCurrentModel] = useState(null);
  const [currentRef, setCurrentRef] = useState(null);
  const [inspectorData, setInspectorData] = useState(null);
  const [textEditorData, setTextEditorData] = useState({});

  useEffect(() => {
    subscribe(events.INSPECTOR_SET, (event, data) => {
      setInspectorData(data);

      if (!data.dataControls) return;

      // Handle components in a special way here.  Could probaby abstract this better

      Object.entries(data.dataControls).forEach(([key, control]) => {
        if (control.controls.component === "longText") {
          // we relay data to the text editor component for display here as well.
          const textData = {
            data: data.data[control.dataKey],
            nodeId: data.nodeId,
            dataKey: control.dataKey,
            name: data.name,
            control: control.controls,
          };

          setTextEditorData(textData);
        }
      });
    });

    subscribe(events.TEXT_EDITOR_SET, (event, data) => {
      setTextEditorData(data);
    });
  }, [events, subscribe, publish]);

  const saveTextEditor = (textData) => {
    const textUpdate = {
      [textData.dataKey]: textData.data,
    };

    publish(events.NODE_SET(textData.nodeId), textUpdate);
    if (inspectorData) {
      setInspectorData({
        ...inspectorData,
        ...textUpdate,
      });
    }
  };

  const saveInspector = (inspectorData) => {
    setInspectorData(inspectorData);
    publish(events.NODE_SET(inspectorData.nodeId), inspectorData.data);
  };

  const createModel = (json) => {
    const model = Model.fromJson(json);
    setCurrentModel(model);

    return model;
  };

  const addWindow = (componentType, title) => {
    // Solution partly taken from here.
    // Programatic creation of a tabSet and a tab added to it.
    // https://github.com/caplin/FlexLayout/issues/54
    const tabJson = {
      type: "tab",
      component: componentType,
      weight: 12,
      name: title,
    };
    const rootNode = currentModel.getRoot();
    const tabNode = new TabNode(currentModel, tabJson);
    const tabSetNode = new TabSetNode(currentModel, {
      type: "tabset",
      weight: 12,
    });

    rootNode._addChild(tabSetNode);

    currentModel.doAction(
      Actions.moveNode(
        tabNode.getId(),
        tabSetNode.getId(),
        DockLocation.RIGHT,
        0
      )
    );
  };

  const createOrFocus = (componentName, title) => {
    const component = Object.entries(currentModel._idMap).find(
      ([key, value]) => {
        return value._attributes?.component === componentName;
      }
    );

    // the nodeId is stored in the zeroth index of the find
    if (component) currentModel.doAction(Actions.selectTab(component[0]));

    if (!component) addWindow(componentName, title);
  };

  const publicInterface = {
    inspectorData,
    textEditorData,
    saveTextEditor,
    saveInspector,
    setCurrentModel,
    currentModel,
    createModel,
    createOrFocus,
    componentTypes,
    currentRef,
    setCurrentRef,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export const Layout = ({ json, factory, tab }) => {
  const { currentModel, createModel, setCurrentRef } = useLayout();
  const layoutRef = useRef(null);

  useEffect(() => {
    if (!json || currentModel) return;
    createModel(json);
  }, [json, createModel, currentModel]);

  useEffect(() => {
    setCurrentRef(layoutRef);
  }, [layoutRef, setCurrentRef]);

  if (!currentModel) return <LoadingScreen />;

  return (
    <LayoutComponent
      ref={layoutRef}
      model={currentModel}
      factory={factory}
      font={{ size: "12px", fontFamily: "IBM Plex Sans" }}
    />
  );
};

export default LayoutProvider;
