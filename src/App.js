import "flexlayout-react/style/dark.css";
import "./dds-globals/dds-globals.css";
import "./App.css";

import { Route, Switch, Redirect } from "wouter";
import ThothPageWrapper from "./features/common/ThothPage/ThothPageWrapper";
import Thoth from "./features/Thoth/Thoth";
import StartScreen from "./features/StartScreen/StartScreen";

import { useTabManager } from "./contexts/TabManager";
import LoadingScreen from "./features/common/LoadingScreen/LoadingScreen";

function App() {
  // Use our routes
  const { tabs } = useTabManager();

  if (!tabs) return <LoadingScreen />;

  return (
    <ThothPageWrapper tabs={tabs}>
      <Switch>
        <Route path="/thoth" component={Thoth} />
        <Route path="/home" component={StartScreen} />
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
