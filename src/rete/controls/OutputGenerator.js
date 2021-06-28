import { useState, useEffect } from "react";
import { Control } from "rete";

const SingleOutput = (props) => {
  return (
    <div style={{ marginBottom: 10 }}>
      <p style={{ display: "inline" }}>{props.name}</p>
      <span style={{ float: "right" }}>
        <button className="list" onClick={() => props.delete(props.name)}>
          Delete
        </button>
      </span>
    </div>
  );
};

const AddNewOutput = (props) => {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onAdd = () => {
    props.addOutput(value);
    setValue("");
  };

  return (
    <>
      <input value={value} type="text" onChange={onChange} />
      <button onClick={onAdd}>Add</button>
    </>
  );
};

const ReactOutputGenerator = ({ setDynamicOutputs, defaultOutputs }) => {
  const [outputs, setOutputs] = useState([...defaultOutputs]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) setDynamicOutputs(outputs);
    if (!loaded) setLoaded(true);
  }, [setDynamicOutputs, outputs, loaded]);

  const onDelete = (name) => {
    const newOutputs = outputs.filter((output) => output !== name);
    setOutputs(newOutputs);
  };

  const addOutput = (output) => {
    const newOutputs = [...outputs, output];
    setOutputs(newOutputs);
  };

  return (
    <>
      {outputs.map((out) => (
        <SingleOutput name={out} delete={onDelete} />
      ))}
      <AddNewOutput addOutput={addOutput} />
    </>
  );
};

export class OutputGenerator extends Control {
  constructor({ key, setOutputs, defaultOutputs }) {
    super(key);
    this.render = "react";
    this.key = key;
    this.component = ReactOutputGenerator;

    const setDynamicOutputs = (outputs) => {
      setOutputs(outputs);
      this.update();
    };

    // we define the props that are passed into the rendered react component here
    this.props = {
      defaultOutputs,
      setDynamicOutputs,
    };
  }
}
