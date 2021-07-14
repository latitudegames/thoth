import { useState, useEffect } from "react";

const SingleOutput = (props) => {
  return (
    <div style={{ marginBottom: 10, flex: 1, width: "100%" }}>
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
    <div style={{ flex: 1, display: "flex" }}>
      <input
        style={{ flex: 6, padding: 0 }}
        value={value}
        type="text"
        onChange={onChange}
      />
      <button style={{ flex: 1 }} onClick={onAdd}>
        Add
      </button>
    </div>
  );
};

const OutputGenerator = ({ updateData, data, name, initialValue }) => {
  const [outputs, setOutputs] = useState([...initialValue]);

  useEffect(() => {
    setOutputs([...initialValue]);
  }, [initialValue]);

  const onDelete = (name) => {
    const newOutputs = outputs.filter((output) => output !== name);
    setOutputs(newOutputs);
  };

  const addOutput = (output) => {
    const newOutputs = [...outputs, output];
    setOutputs(newOutputs);
    updateData({ [name]: newOutputs });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {outputs.map((out, i) => (
        <SingleOutput name={out} key={i} delete={onDelete} />
      ))}
      <AddNewOutput addOutput={addOutput} />
    </div>
  );
};

export default OutputGenerator;
