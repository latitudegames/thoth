import { useState, useEffect } from "react";
import { Control } from "rete";

const ReactTextInputControl = (props) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue(props.value);
    props.putData(props.name, props.value);
  }, [props]);

  const onChange = (e) => {
    props.putData(props.name, e.target.value);
    setValue(e.target.value);
  };

  return <input type="text" value={value} onChange={onChange} />;
};

export class TextInputControl extends Control {
  constructor({ emitter, key, value }) {
    super(key);
    this.render = "react";
    this.component = ReactTextInputControl;

    // we define the props that are passed into the rendered react component here
    this.props = {
      emitter,
      name: key,
      value,
      putData: (...args) => this.putData.apply(this, args),
    };
  }
}
