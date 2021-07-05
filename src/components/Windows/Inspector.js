import { useEffect, useState } from "react";
import { Flex, Box } from "rebass";
import TextareaAutosize from "react-textarea-autosize";
import {
  Label,
  Input as InputComponent,
  Textarea as TextareaComponent,
} from "@rebass/forms";

import { usePubSub } from "../../contexts/PubSub";

const Input = (props) => {
  const onChange = (e) => {
    const update = {
      [props.name]: e.target.value,
    };
    props.updateData(update);
  };

  return (
    <Box>
      <Label htmlFor="email">Email</Label>
      <InputComponent
        id={props.name}
        name={props.name}
        type={props.name}
        onChange={onChange}
      />
    </Box>
  );
};

const Textarea = (props) => {
  const onChange = (e) => {
    const update = {
      [props.name]: e.target.value,
    };
    props.updateData(update);
  };

  return (
    <Box>
      <Label htmlFor="comment">Comment</Label>
      <TextareaAutosize
        onChange={onChange}
        id={props.name}
        value={props.value}
        style={{ resize: "vertical" }}
      />
    </Box>
  );
};

// const Slider = () => {};

// const Switch = () => {};

// const Radio = () => {};

// const select = () => {};

const Inspector = () => {
  const { publish, subscribe, events } = usePubSub();
  const [data, setData] = useState("");

  useEffect(() => {
    subscribe(events.INSPECTOR_SET, (event, data) => {
      console.log("DATA", data);
      setData(data);
    });
  }, [events, subscribe]);

  const onSave = () => {
    const parsed = JSON.parse(data);
    publish(events.NODE_SET(parsed.nodeId), parsed);
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
      <Flex>
        {data.dataControls &&
          Object.entries(data.dataControls).map(([key, value], i) => {
            console.log("switching!", value);
            switch (value.type) {
              case "textarea":
                return (
                  <Textarea
                    key={i + key}
                    name={key}
                    value={data.data[key] || ""}
                    updateData={updateData}
                  />
                );
              default:
                return <></>;
            }
          })}
        <Box flex={8}>
          <button className="primary" onClick={onSave}>
            Save
          </button>
        </Box>
      </Flex>
    </>
  );
};

export default Inspector;
