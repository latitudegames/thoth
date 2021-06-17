import { useState, useEffect } from "react";
import { Control } from "rete";

const ReactTextInputControl = (props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(props.value);
    props.putData(props.key, props.value);
  }, [props]);

  const onChange = (e) => {
    props.putData(props.key, e.target.value);
    setValue(e.target.value);
  };

  const onButton = () => {
    props.emitter.trigger("process");
  };

  return (
    <>
      <input value={value} onChange={onChange} />
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
      putData: (...args) => this.putData.apply(this, args),
    };
  }
}
