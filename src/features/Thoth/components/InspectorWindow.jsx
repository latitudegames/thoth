import { useEffect, useState } from "react";

import Window from "../../common/Window/Window";
import { useLayout } from "../../../contexts/LayoutProvider";
import DataControls from "./DataControls";
import css from "./DataControls/datacontrols.module.css";
import Icon, { componentCategories } from "../../common/Icon/Icon";

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

    return () => {
      props.node.removeEventListener("resize");
    };
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
  console.log(inspectorData);

  const toolbar = (
    <>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <Icon
          name={componentCategories[inspectorData?.category]}
          style={{ marginRight: "var(--extraSmall)" }}
        />
        {inspectorData?.name}
      </div>
    </>
  );

  if (!inspectorData)
    return <p className={css["message"]}>No component selected</p>;

  return (
    <Window toolbar={toolbar} darker outline borderless>
      <DataControls
        inspectorData={inspectorData}
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
