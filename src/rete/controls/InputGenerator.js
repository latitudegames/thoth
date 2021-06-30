import { useState, useEffect } from "react";
import { Control } from "rete";

const SingleInput = (props) => {
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

const AddNewInput = (props) => {
  const [value, setValue] = useState("");

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onAdd = () => {
    props.addInput(value);
    setValue("");
  };

  return (
    <>
      <input value={value} type="text" onChange={onChange} />
      <button onClick={onAdd}>Add</button>
    </>
  );
};

const ReactInputGenerator = ({ setDynamicInputs, defaultInputs }) => {
  const [outputs, setOutputs] = useState([...defaultInputs]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) setDynamicInputs(outputs);
    if (!loaded) setLoaded(true);
  }, [setDynamicInputs, outputs, loaded]);

  const onDelete = (name) => {
    const newOutputs = outputs.filter((output) => output !== name);
    setOutputs(newOutputs);
  };

  const addInput = (output) => {
    const newOutputs = [...outputs, output];
    setOutputs(newOutputs);
  };

  return (
    <>
      {outputs.map((out, i) => (
        <SingleInput name={out} key={i} delete={onDelete} />
      ))}
      <AddNewInput addInput={addInput} />
    </>
  );
};

export class OutputGenerator extends Control {
  constructor({ key, setOutputs, defaultInputs }) {
    super(key);
    this.render = "react";
    this.key = key;
    this.component = ReactInputGenerator;

    const setDynamicInputs = (outputs) => {
      setOutputs(outputs);
      this.update();
    };

    // we define the props that are passed into the rendered react component here
    this.props = {
      defaultInputs,
      setDynamicInputs,
    };
  }
}
