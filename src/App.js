import "flexlayout-react/style/dark.css";

import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Spell from "./features/spell/Spell";

import "./dds-globals/dds-globals.css";
import "./App.css";

function App() {
  const tabs = [
    {
      name: "My Spell",
      type: "spell",
      active: true,
    },
    {
      name: "My Enki",
      type: "Enki",
      active: false,
    },
  ];

  return (
    <ThothPageWrapper tabs={tabs}>
      <Spell />
    </ThothPageWrapper>
  );
}

export default App;
