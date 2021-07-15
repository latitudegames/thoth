import "flexlayout-react/style/dark.css";

import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Spell from "./features/spell/Spell";
import StartScreen from "./features/common/StartScreen/StartScreen"

import "./dds-globals/dds-globals.css";
import "./App.css";

function App() {
  let tabs = []
  tabs = [
    {
      name: "My Spell",
      type: "spell",
      active: true,
    },
    {
      name: "My Spell",
      type: "spell",
      active: false,
    },
    {
      name: "My Spell",
      type: "spell",
      active: false,
    },
  ];

  return (
    <ThothPageWrapper tabs={tabs}>
      {tabs.length ? <Spell /> : <><Spell empty/><StartScreen /></>}
    </ThothPageWrapper>
  );
}

export default App;
