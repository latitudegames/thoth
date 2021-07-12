import { useState, useEffect, useCallback } from "react";

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

const OutputGenerator = ({ updateData, data, name }) => {
  const { defaultOutputs } = data;
  const [outputs, setOutputs] = useState([...defaultOutputs]);

  const update = useCallback((outputs) => updateData(outputs), []);

  useEffect(() => {
    update({ [name]: outputs });
  }, [update, outputs, name]);

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
      {outputs.map((out, i) => (
        <SingleOutput name={out} key={i} delete={onDelete} />
      ))}
      <AddNewOutput addOutput={addOutput} />
    </>
  );
};

export default OutputGenerator;
