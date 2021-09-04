import { Route, Switch, Redirect } from "wouter";
import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Thoth from "./features/Thoth/Thoth";
import StartScreen from "./features/StartScreen/StartScreen";
import LoginScreen from "./features/Login/LoginScreen";

import { useTabManager } from "./contexts/TabManagerProvider";
import LoadingScreen from "./features/common/LoadingScreen/LoadingScreen";

import "flexlayout-react/style/dark.css";
import "./design-globals/design-globals.css";
import "./App.css";
//These need to be imported last to override styles.

function App() {
  // Use our routes
  const { tabs } = useTabManager();

  const CreateNewScreen = () => {
    return <StartScreen createNew={true} />;
  };

  const AllProjectsScreen = () => {
    return <StartScreen allProjects={true} />;
  };

  if (!tabs) return <LoadingScreen />;

  return (
    <ThothPageWrapper tabs={tabs}>
      <Switch>
        <Route path="/login" component={LoginScreen} />
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
  );
}

export default App;
