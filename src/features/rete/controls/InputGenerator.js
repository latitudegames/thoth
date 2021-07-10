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

const ReactInputGenerator = ({ setDynamicInputs, defaultInputs, ignored }) => {
  const [inputs, setInputs] = useState([...defaultInputs]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) setDynamicInputs(inputs);
    if (!loaded) setLoaded(true);
  }, [setDynamicInputs, inputs, loaded]);

  const onDelete = (name) => {
    const newInputs = inputs.filter((input) => input !== name);
    setInputs(newInputs);
  };

  const addInput = (input) => {
    const newInputs = [...inputs, input];
    setInputs(newInputs);
  };

  return (
    <>
      {inputs
        .filter((input) => !ignored.includes(input))
        .map((input, i) => (
          <SingleInput name={input} key={i} delete={onDelete} />
        ))}
      <AddNewInput addInput={addInput} />
    </>
  );
};

export class InputGenerator extends Control {
  constructor({ key, setInputs, defaultInputs, ignored }) {
    super(key);
    this.render = "react";
    this.key = key;
    this.component = ReactInputGenerator;

    const setDynamicInputs = (inputs) => {
      // add the ignored inputs to the inputs here so they wont get deleted.
      setInputs(inputs);
      this.update();
    };

    // we define the props that are passed into the rendered react component here
    this.props = {
      defaultInputs,
      setDynamicInputs,
      ignored,
    };
  }
}
