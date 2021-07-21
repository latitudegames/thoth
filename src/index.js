import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AppProviders from "./contexts/AppProviders";
import reportWebVitals from "./reportWebVitals";
import Joyride from 'react-joyride';
const state = {
  steps: [
    {
      target: '.startScreen_version-banner__2-Q0f',
      content: 'Welcome to Thoth! Lets get started...',
    },
    {
      target: '.startScreen_button-row__2XZch',
      content: 'Click here to compose your first spell',
    },
  ]
};
ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <>
      <Joyride
          steps={state.steps} />
      <App />
      </>
    </AppProviders>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
