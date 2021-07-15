import { useEffect, useState } from "react";

import Window from "../../../common/Window/Window";
import { useLayout } from "../../../../contexts/Layout";
import DataControls from "./components/DataControls";
import LoadingScreen from "../../../common/LoadingScreen/LoadingScreen";

const Inspector = (props) => {
  const { inspectorData, saveInspector } = useLayout();
  const [width, setWidth] = useState();

  useEffect(() => {
    if (props?.node?._rect?.width) {
      setWidth(props.node._rect.width);
    }

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener("resize", (data) => {
      setTimeout(() => {
        setWidth(data.rect.width);
      }, 0);
    });
  }, [props]);

  const updateData = (update) => {
    const newData = {
      ...inspectorData,
      data: {
        ...inspectorData.data,
        ...update,
      },
    };

    saveInspector(newData);
  };

  const toolbar = (
    <>
      <button className="small">Something</button>
    </>
  );

  if (!inspectorData) return <LoadingScreen />;

  return (
    <Window toolbar={toolbar} dark border>
      <h1>{inspectorData.name}</h1>
      <DataControls
        nodeId={inspectorData.nodeId}
        dataControls={inspectorData.dataControls}
        data={inspectorData.data}
        width={width}
        updateData={updateData}
      />
    </Window>
  );
};

export default Inspector;
