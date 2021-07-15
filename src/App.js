import "flexlayout-react/style/dark.css";

import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Thoth from "./features/Thoth/Thoth";
import StartScreen from "./features/StartScreen/StartScreen";

import "./dds-globals/dds-globals.css";
import "./App.css";

function App() {
  let tabs = [];
  tabs = [
    {
      name: "My Spell",
      type: "spell",
      active: true,
    },
  ];

  return (
    <ThothPageWrapper tabs={tabs}>
      {tabs.length ? (
        <Thoth />
      ) : (
        <>
          <Thoth empty />
          <StartScreen />
        </>
      )}
    </ThothPageWrapper>
  );
}

export default App;
