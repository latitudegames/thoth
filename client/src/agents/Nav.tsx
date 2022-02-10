//@ts-nocheck

import React from "react";
import { views } from './views';

export default function Nav({ currentView, changeView }) {
  return (
    <div className="nav">
      <span onClick={() => changeView(views.Personalities)} className={currentView === views.Personalities ? "nav-item-active" : "nav-item"} >
        Personalities
      </span>

      <span onClick={() => changeView(views.Agents)} className={currentView === views.Agents ? "nav-item-active" : "nav-item"} >
        Agents
      </span>

      <span onClick={() => changeView(views.Settings)} className={currentView === views.Settings ? "nav-item-active" : "nav-item"} >
        Settings
      </span>

      <span onClick={() => changeView(views.AgentsSettings)} className={currentView === views.AgentsSettings ? "nav-item-active" : "nav-item"} >
        Agents Settings
      </span>

      <span onClick={() => changeView(views.Prompts)} className={currentView === views.Prompts ? "nav-item-active" : "nav-item"} >
        Prompts
      </span>

      <span onClick={() => changeView(views.Profanity)} className={currentView === views.Profanity ? "nav-item-active" : "nav-item"} >
        Profanity
      </span>
    </div>
  );
}
