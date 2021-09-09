import { useEffect, useState } from "react";
import { Route, Switch, Redirect } from "wouter";
import { useAuth } from "./contexts/AuthProvider";
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
  const [checked, setChecked] = useState(false);
  const { tabs } = useTabManager();
  const { user, getUser, checkIn } = useAuth();

  useEffect(() => {
    (async () => {
      const currentUser = await getUser();

      if (currentUser) {
        // checkin?
        checkIn(currentUser);
      }

      setChecked(true);
    })();
  }, []);

  const CreateNewScreen = () => {
    return <StartScreen createNew={true} />;
  };

  const AllProjectsScreen = () => {
    return <StartScreen allProjects={true} />;
  };

  if (!tabs || !checked) return <LoadingScreen />;

  return (
    <ThothPageWrapper tabs={tabs}>
      <Switch>
        <Route path="/login" component={LoginScreen} />
        <Route path="/thoth" component={Thoth} />
        <Route path="/home" component={StartScreen} />
        <Route path="/home/create-new" component={CreateNewScreen} />
        <Route path="/home/aall-projects" component={AllProjectsScreen} />
        <Route path="/">
          {user ? <Redirect to="/home" /> : <Redirect to="/login" />}
        </Route>
      </Switch>
    </ThothPageWrapper>
  );
}

export default App;
