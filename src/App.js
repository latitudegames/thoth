import "flexlayout-react/style/dark.css";

import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Spell from "./features/spell/Spell";
import StartScreen from "./features/common/StartScreen/StartScreen"

import "./dds-globals/dds-globals.css";
import "./App.css";

function App() {
  const tabs = [
    {
      name: "My Spell",
      type: "spell",
      active: true,
    }
  ];

  return (
    <ThothPageWrapper tabs={tabs}>
      <Spell />
      <StartScreen />
    </ThothPageWrapper>
  );
}

export default App;
