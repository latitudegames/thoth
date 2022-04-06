import './wdyr'
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'

import App from './App'
import AppProviders from './contexts/AppProviders'
import reportWebVitals from './reportWebVitals'
import { persistor, store } from './state/store'

ReactDOM.render(
  <Router>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppProviders>
          <React.StrictMode>
            <App />
          </React.StrictMode>
        </AppProviders>
      </PersistGate>
    </Provider>
  </Router>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
