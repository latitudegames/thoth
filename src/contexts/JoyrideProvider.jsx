import { useContext, createContext, useState } from "react";
import { ACTIONS, EVENTS, STATUS } from "react-joyride";

const basicFlowState = {
  steps: [
    {
      target: "#basicFlow1",
      content: "Welcome to Thoth! Lets get started...",
      showSkipButton: true
    },
  ],
  stepIndex: 0,
  run: true,
};

const Context = createContext({
  flowState: basicFlowState,
});
export const useJoyride = () => useContext(Context);

const JoyrideProvider = ({ children }) => {
  const [flowState, setFlowState] = useState(basicFlowState);

  const joyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      // setFlowState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      setFlowState({ run: false });
    }

    console.groupCollapsed(type);
    console.log(data); //eslint-disable-line no-console
    console.groupEnd();
  };

  const publicInterface = {
    flowState,
    setFlowState,
    joyrideCallback,
  };

  return (
    <Context.Provider value={publicInterface}>{children}</Context.Provider>
  );
};

export default JoyrideProvider;
