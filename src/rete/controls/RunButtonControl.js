import { Control } from "rete";

const ReactRunButton = (props) => {
  const onButton = () => {
    props.emitter.trigger("process");
    props.run();
  };

  return <button onClick={onButton}>RUN</button>;
};

export class RunButtonControl extends Control {
  constructor({ key, emitter, run }) {
    super(key);
    this.render = "react";
    this.key = key;
    this.component = ReactRunButton;

    // we define the props that are passed into the rendered react component here
    this.props = {
      emitter,
      run,
    };
  }
}
