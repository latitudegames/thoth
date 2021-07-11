import { useEffect, useState } from "react";

import Window from "../../../common/Window/Window";
import { useLayout } from "../../../../contexts/Layout";
import { usePubSub } from "../../../../contexts/PubSub";
import DataControls from "./components/DataControls";
import LoadingScreen from "../../../common/LoadingScreen/LoadingScreen";

const Inspector = (props) => {
  const { publish, events } = usePubSub();
  const { inspectorData } = useLayout();
  const [data, setData] = useState("");
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

  useEffect(() => {
    setData(inspectorData);
  }, [inspectorData]);

  const onSave = () => {
    publish(events.NODE_SET(data.nodeId), data.data);
  };

  const updateData = (update) => {
    const newData = {
      ...data,
      ...update,
    };

    setData(newData);
  };

  const toolbar = (
    <>
      <button className="small" onClick={onSave}>
        Save
      </button>
    </>
  );

  if (!data) return <LoadingScreen />;

  return (
    <Window toolbar={toolbar}>
      <DataControls
        nodeId={data.nodeId}
        dataControls={data.dataControls}
        data={data.data}
        width={width}
        updateData={updateData}
      />
    </Window>
  );
};

export default Inspector;
