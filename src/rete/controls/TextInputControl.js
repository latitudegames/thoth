import { useState, useEffect } from "react";
import { Control } from "rete";

const ReactTextInputControl = (props) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(props.name);
    props.putData(props.key, props.value);
  }, []);

  const onChange = (e) => {
    props.putData(props.key, e.target.value);
    setName(e.target.value);
  };

  const onButton = () => {
    props.emitter.trigger("process");
  };

  return (
    <>
      <input value={name} onChange={onChange} />
      <p>Result: {props.display}</p>
      <button onClick={onButton}>RUN</button>
    </>
  );
};

export class TextInputControl extends Control {
  constructor({ emitter, key, value }) {
    super(key);
    this.render = "react";
    this.key = key;
    this.component = ReactTextInputControl;

    // we define the props that are passed into the rendered react component here
    this.props = {
      emitter,
      key,
      value,
      display: "",
      putData: (...args) => this.putData.apply(this, args),
    };
  }

  display(val) {
    this.props.display = val;
    this.putData("display", val);
    this.update();
  }

  setValue(val) {
    this.props.value = val;
    this.putData(this.key, val);
  }
}
