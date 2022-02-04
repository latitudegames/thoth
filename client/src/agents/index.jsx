import { default as React, useState } from 'react';
import Agents from './Agents';
import Personalities from "./Personalities";
import Profanity from './Profanity';
import Prompts from './Prompts';
import Settings from './Settings';
import AgentsSettings from './AgentsSettings';
import { views } from './views';
import Nav from "./Nav";

const App = () => {
  const [currentView, setCurrentView] = useState(views.Personalities);

  const changeView = (view) => {
    setCurrentView(view);
  }

  return (
    <div className="agents-container">
      <Nav currentView={currentView} changeView={changeView} />
      {currentView === views.Personalities && <Personalities />}
      {currentView === views.Settings && <Settings />}
      {currentView === views.Agents && <Agents />}
      {currentView === views.Profanity && <Profanity />}
      {currentView === views.Prompts && <Prompts />}
      {currentView === views.AgentsSettings && <AgentsSettings />}
    </div>
  )

};

export default App;
