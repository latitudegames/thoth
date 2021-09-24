import { Control } from "rete";
import React from "react";
const ReactTextInputControl = (props) => {
  return <p style={{ width: 200 }}>Result: {props.display}</p>;
};

export class DisplayControl extends Control {
  constructor({ key, defaultDisplay = "" }) {
    super(key);
    this.render = "react";
    this.key = key;
    this.component = ReactTextInputControl;

    // we define the props that are passed into the rendered react component here
    this.props = {
      display: defaultDisplay,
    };
  }

  display(val) {
    this.props.display = val;
    this.putData("display", val);
    this.update();
  }
}
