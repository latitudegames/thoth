import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import Collapsible from "react-collapsible";
import { Flex, Box } from "rebass";
import TextareaAutosize from "react-textarea-autosize";
import { Label, Input as InputComponent } from "@rebass/forms";

import { usePubSub } from "../../contexts/PubSub";

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

// const Slider = () => {};

// const Switch = () => {};

// const Radio = () => {};

// const Select = () => {};

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

  return (
    <>
      <p>Component Data:</p>
      <Flex flexDirection="column" css={{ padding: 10 }}>
        <Box flex={8}>
          <button className="primary" onClick={onSave}>
            Save
          </button>
        </Box>
        <Box css={{ padding: 10, paddingTop: 20 }}>
          <Scrollbars style={{ width, height }}>
            {data.dataControls &&
              Object.entries(data.dataControls).map(([key, value], i) => {
                const props = {
                  width,
                  key,
                  name: key,
                  initialValue: data.data[key] || "",
                  updateData,
                };
                switch (value.type) {
                  case "textarea":
                    return (
                      <Textarea
                        width={width - 20}
                        key={i + key}
                        name={key}
                        initialValue={data.data[key] || ""}
                        updateData={updateData}
                      />
                    );
                  default:
                    return <></>;
                }
              })}
          </Scrollbars>
        </Box>
      </Flex>
    </>
  );
};

export default Inspector;
