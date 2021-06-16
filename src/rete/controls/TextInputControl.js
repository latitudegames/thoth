import React from "react";
import { Control } from "rete";

class ReactTextInputControl extends React.Component {
  state = {};
  componentDidMount() {
    this.setState({
      name: this.props.name,
    });
    console.log(this.props);
    // putData adds a key/value to the node
    this.props.putData(this.props.id, this.props.name);
  }
  onChange(event) {
    this.props.putData(this.props.id, event.target.value);
    this.props.emitter.trigger("process");
    this.setState({
      name: event.target.value,
    });
  }

  render() {
    return (
      <input value={this.state.name} onChange={this.onChange.bind(this)} />
    );
  }
}

export class TextInputControl extends Control {
  constructor(emitter, key, name) {
    super(key);
    this.render = "react";
    this.component = ReactTextInputControl;

    console.log(this.putData);

    // we define the props that are passed into the rendered react component here
    this.props = {
      emitter,
      id: key,
      name,
      putData: (...args) => this.putData.apply(this, args),
    };
  }
}
