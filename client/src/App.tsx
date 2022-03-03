import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import { useAuth } from './contexts/AuthProvider'
import { useTabManager } from './contexts/TabManagerProvider'
import RequireAuth from './features/common/RequireAuth/RequireAuth'
import LoadingScreen from './features/common/LoadingScreen/LoadingScreen'
import ThothPageWrapper from './features/common/ThothPage/ThothPageWrapper'
import LoginScreen from './features/Login/LoginScreen'
import HomeScreen from './features/HomeScreen/HomeScreen'
import Thoth from './features/Thoth/Thoth'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'
//These need to be imported last to override styles.

function App() {
  // Use our routes
  const [checked] = useState(false)
  const { tabs, activeTab } = useTabManager()
  const { user } = useAuth()

  const redirect = () => {
    if (user && tabs.length > 0) {
      return <Navigate to="/thoth" />
    }

    return user ? <Navigate to="/home" /> : <Navigate to="/login" />
  }

  if (!user) return <LoadingScreen />

  return (
    <ThothPageWrapper tabs={tabs} activeTab={activeTab}>
      <Routes>
        <Route element={<RequireAuth />}>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/thoth" element={<Thoth />} />
          <Route path="/thoth/:spellName" element={<Thoth />} />
          <Route path="/home/*" element={<HomeScreen />} />
          <Route path="/" element={redirect()} />
        </Route>
      </Routes>
    </ThothPageWrapper>
  )
}

export default App
