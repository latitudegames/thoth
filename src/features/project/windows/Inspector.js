import { useEffect, useState } from "react";
import Collapsible from "react-collapsible";
import TextareaAutosize from "react-textarea-autosize";

import Window from "../../common/Window/Window";
import { usePubSub } from "../../../contexts/PubSub";

const Textarea = (props) => {
  const [value, setValue] = useState();

  useEffect(() => {
    setValue(props.initialValue);
  }, [props.initialValue]);

  const onChange = (e) => {
    const update = {
      [props.name]: e.target.value,
    };
    setValue(e.target.value);
    props.updateData(update);
  };

  return (
    <Collapsible trigger={props.name}>
      <TextareaAutosize
        onChange={onChange}
        id={props.name}
        value={value}
        style={{ resize: "vertical", width: props.width }}
      />
    </Collapsible>
  );
};

const Inspector = (props) => {
  const { publish, subscribe, events } = usePubSub();
  const [data, setData] = useState("");
  const [height, setHeight] = useState();
  const [width, setWidth] = useState();

  const bottomHeight = 50;

  useEffect(() => {
    if (props?.node?._rect?.height) {
      setHeight(props.node._rect.height - bottomHeight);
      setWidth(props.node._rect.width);
    }

    // this is to dynamically set the appriopriate height so that Monaco editor doesnt break flexbox when resizing
    props.node.setEventListener("resize", (data) => {
      setTimeout(() => {
        setHeight(data.rect.height - bottomHeight);
        setWidth(data.rect.width);
      }, 0);
    });
  }, [props]);

  useEffect(() => {
    subscribe(events.INSPECTOR_SET, (event, data) => {
      console.log("DATA", data);
      setData(data);
    });
  }, [events, subscribe]);

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

  return (
    <Window toolbar={toolbar}>
      {data.dataControls &&
        Object.entries(data.dataControls).map(([key, value], i) => {
          const controlProps = {
            width,
            key,
            name: key,
            initialValue: data.data[key] || "",
            updateData,
          };
          switch (value.type) {
            case "textarea":
              return <Textarea {...controlProps} />;
            default:
              return <></>;
          }
        })}
    </Window>
  );
};

export default Inspector;
