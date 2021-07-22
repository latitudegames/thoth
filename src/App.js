import { Route, Switch, Redirect } from "wouter";
import Joyride from "react-joyride";
import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Thoth from "./features/Thoth/Thoth";
import StartScreen from "./features/StartScreen/StartScreen";

import { useTabManager } from "./contexts/TabManagerProvider";
import { useJoyride } from "./contexts/JoyrideProvider";
import LoadingScreen from "./features/common/LoadingScreen/LoadingScreen";

import "flexlayout-react/style/dark.css";
import "./dds-globals/dds-globals.css";
import "./App.css";
//These need to be imported last to override styles.

function App() {
  // Use our routes
  const { tabs } = useTabManager();
  const { state } = useJoyride();

  const CreateNewScreen = () => {
    return <StartScreen createNew={true} />;
  };

  const AllProjectsScreen = () => {
    return <StartScreen allProjects={true} />;
  };

  if (!tabs) return <LoadingScreen />;

  return (
    <>
      <Joyride steps={state.steps} />
      <ThothPageWrapper tabs={tabs}>
        <Switch>
          <Route path="/thoth">
            <Thoth />
          </Route>
          <Route path="/home" component={StartScreen} />
          <Route path="/home/create-new" component={CreateNewScreen} />
          <Route path="/home/all-projects" component={AllProjectsScreen} />
          <Route path="/">
            {tabs.length === 0 ? (
              <Redirect to="/home" />
            ) : (
              <Redirect to="/thoth" />
            )}
          </Route>
        </Switch>
      </ThothPageWrapper>
    </>
  );
}

export default App;
