import "flexlayout-react/style/dark.css";

import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Project from "./features/project/Project";

import "./dds-globals/dds-globals.css";
import "./App.css";

function App() {
  const tabs = [
    {
      name: "My Project",
      type: "Project",
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
      <Project />
    </ThothPageWrapper>
  );
}

export default App;
