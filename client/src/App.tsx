import { Routes, Route, Navigate } from 'react-router-dom'

import RequireAuth from './features/common/RequireAuth/RequireAuth'
import ThothPageWrapper from './features/common/ThothPage/ThothPageWrapper'
import HomeScreen from './features/HomeScreen/HomeScreen'
import Thoth from './features/Thoth/Thoth'
import { useAuth } from './contexts/AuthProvider'

import 'flexlayout-react/style/dark.css'
import './design-globals/design-globals.css'
import './App.css'
import { activeTabSelector, selectAllTabs } from './state/tabs'
import { useSelector } from 'react-redux'
import { RootState } from './state/store'
//These need to be imported last to override styles.

function App() {
  // Use our routes
  const tabs = useSelector((state: RootState) => selectAllTabs(state.tabs))
  const activeTab = useSelector(activeTabSelector)
  const { user } = useAuth()

  const redirect = () => {
    if (user && tabs.length > 0) {
      return <Navigate to="/thoth" />
    }

    return user ? <Navigate to="/home" /> : <Navigate to="/login" />
  }

  return (
    <ThothPageWrapper tabs={tabs} activeTab={activeTab}>
      <Routes>
        <Route element={<RequireAuth />}>
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
