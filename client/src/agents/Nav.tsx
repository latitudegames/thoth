//@ts-nocheck

import React from "react";
import { views } from './views';

export default function Nav({ currentView, changeView }) {
  return (
    <div className="nav">
      <span onClick={() => changeView(views.Agents)} className={currentView === views.Agents ? "nav-item-active" : "nav-item"} >
        Agents
      </span>

      <span onClick={() => changeView(views.AgentInstances)} className={currentView === views.AgentInstances ? "nav-item-active" : "nav-item"} >
        Instances
      </span>

      <span onClick={() => changeView(views.Config)} className={currentView === views.Config ? "nav-item-active" : "nav-item"} >
        Config
      </span>

      <span onClick={() => changeView(views.Prompts)} className={currentView === views.Prompts ? "nav-item-active" : "nav-item"} >
        Prompts
      </span>
    </div>
  );
}
