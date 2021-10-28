import { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'

import { useAuth } from './contexts/AuthProvider'
import { useTabManager } from './contexts/TabManagerProvider'
import GuardedRoute from './features/common/GuardedRoute/GuardedRoute'
import LoadingScreen from './features/common/LoadingScreen/LoadingScreen'
import ThothPageWrapper from './features/common/ThothPage/ThothPageWrapper'
import LoginScreen from './features/Login/LoginScreen'
import StartScreen from './features/StartScreen/StartScreen'
import Thoth from './features/Thoth/Thoth'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'
//These need to be imported last to override styles.

function App() {
  // Use our routes
  const [checked, setChecked] = useState(false)
  const { tabs } = useTabManager()
  const { user, getUser, checkIn } = useAuth()

  const authCheck = user && user.accessToken

  useEffect(() => {
    ;(async () => {
      const currentUser = await getUser()

      if (currentUser) {
        // checkin?
        checkIn(currentUser)
      }

      setChecked(true)
    })()
  }, [])

  const CreateNewScreen = () => {
    return <StartScreen createNew={true} />
  }

  const AllProjectsScreen = () => {
    return <StartScreen allProjects={true} />
  }

  const HomeScreen = () => {
    return <StartScreen />
  }

  const redirect = () => {
    if (user && tabs.length > 0) {
      return <Redirect to="/thoth" />
    }

    return user ? <Redirect to="/home" /> : <Redirect to="/login" />
  }

  if (!checked) return <LoadingScreen />

  return (
    <ThothPageWrapper tabs={tabs}>
      <Switch>
        <Route path="/login" children={<LoginScreen />} />
        <GuardedRoute path="/thoth" children={<Thoth />} />
        <GuardedRoute path="/home" children={<HomeScreen />} />
        <GuardedRoute path="/home/create-new" children={<CreateNewScreen />} />
        <GuardedRoute
          path="/home/all-projects"
          children={<AllProjectsScreen />}
        />
        <Route path="/">{redirect()}</Route>
      </Switch>
    </ThothPageWrapper>
  )
}

export default App
