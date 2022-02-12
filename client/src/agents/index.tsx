//@ts-nocheck

import { default as React, useState } from 'react';
import Agents from './Agents';
import AgentInstances from "./AgentInstances";
import Prompts from './Prompts';
import Config from './Config';
import { views } from './views';
import Nav from "./Nav";

const App = () => {
  const [currentView, setCurrentView] = useState(views.Agents);

  const changeView = (view) => {
    setCurrentView(view);
  }

  return (
    <div className="agents-container">
      <Nav currentView={currentView} changeView={changeView} />
      {currentView === views.Agents && <Agents />}
      {currentView === views.Config && <Config />}
      {currentView === views.AgentInstances && <AgentInstances />}
      {currentView === views.Prompts && <Prompts />}
    </div>
  )

};

export default App;
