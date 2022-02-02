import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import { useAuth } from './contexts/AuthProvider'
import { useTabManager } from './contexts/TabManagerProvider'
import GuardedRoute from './features/common/GuardedRoute/GuardedRoute'
import LoadingScreen from './features/common/LoadingScreen/LoadingScreen'
import ThothPageWrapper from './features/common/ThothPage/ThothPageWrapper'
import LoginScreen from './features/Login/LoginScreen'
import HomeScreen from './features/HomeScreen/HomeScreen'
import Thoth from './features/Thoth/Thoth'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'
//These need to be imported last to override styles.

const useLatitude = false; // process.env.REACT_APP_USE_LATITUDE

function App() {
  // Use our routes
  const [checked, setChecked] = useState(false)
  const { tabs, activeTab } = useTabManager()
  const { user, getUser, checkIn } = useAuth()
  const navigate = useNavigate()

  const authCheck = user && user.accessToken

  useEffect(() => {
    ; (async () => {
      const currentUser = await getUser()

      if (currentUser) {
        // checkin?
        checkIn(currentUser)
      }

      setChecked(true)
    })()
  }, [])

  const redirect = () => {
    if (user && tabs.length > 0) {
      return <Navigate to="/thoth" />
    }

    return user ? <Navigate to="/home" /> : <Navigate to="/login" />
  }

  if (!checked) return <LoadingScreen />

  return (
    <ThothPageWrapper tabs={tabs} activeTab={activeTab}>
      <Routes>
        <Route path="/thoth" element={<GuardedRoute />}>
          <Route path="/thoth" element={<Thoth />} />
        </Route>
        <Route path="/home/*" element={<GuardedRoute />} >
          <Route path="/home/*" element={<HomeScreen />} />
        </Route>
        <Route path="/" element={<GuardedRoute />}>
          <Route path="/" element={<Thoth />} />
          <Route path="/login" element={<LoginScreen />} />
        </Route>
        {
          useLatitude &&
          <React.Fragment>
            <Route path="/" element={redirect()} />
          </React.Fragment>
        }
      </Routes>
    </ThothPageWrapper>
  )
}

export default App
