//@ts-nocheck

import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';

const AIEditor = () => {
  const [agents, setAgents] = useState();
  const [currentAgentData, setCurrentAgentData] = useState(null);
  const newAgentRef = useRef("New Agent");

  const createNew = async () => {
    console.log("newAgentRef.current is,", newAgentRef.current.value)
    const agent = newAgentRef.current.value ?? "New Agent";
    await update(agent);
    await getAgents();
  }

  const deleteAgent = async (agent) => {
    const body = { agentName: agent.agent ?? agent };
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/agent`, body);
    console.log("deleted", res);
    await getAgents();
  }

  const update = async (agent) => {
    const body = { agentName: agent ?? currentAgentData.agentName, data: currentAgentData };
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/agent`, body);
    console.log("updated, switching to", agent);
    switchAgent(agent);
  }

  const getAgents = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/agents`)

    if (res.data.length == 0) return setAgents([]);
    let newAgents = [];
    for (let i = 0; i < res.data.length; i++) {
      newAgents.push(res.data[i]);
    }
    console.log("newAgents", newAgents);
    setAgents(newAgents);
    switchAgent(newAgents && newAgents[0]);
    return newAgents;
  }

  const switchAgent = async (agent) => {
    if (!agent) return;
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/agent?agent=${agent.agent ?? agent}`);
    res.data.agentName = agent.agent;
    setCurrentAgentData(res.data);
  }

  useEffect(async () => {
    const newAgents = await getAgents();
    switchAgent(newAgents && newAgents[0]);
  }, [])

  return (
    <div className="agent-container">
      <input type="text" ref={newAgentRef} />
      <input className='button' type='button' value='Create' onClick={async (e) => { e.preventDefault(); await createNew(); }} />
      <div>
        {!agents ? (
          <h1>Loading...</h1>
        ) : (
          <div className="agent-header">
            <h2>Agent: {currentAgentData ? currentAgentData.agentName : "Loading..."}</h2>
            <span className="agent-select">
              <select name="agents" id="agents" onChange={(event) => {
                switchAgent(agents[event.target.options.selectedIndex]);
              }}>
                {agents.length > 0 && agents.map((agent, idx) =>
                  <option value={agent.agent} key={idx}>{agent.agent}</option>
                )}
                {agents.length === 0 && "No personalities found"}
              </select>
            </span>
          </div>
        )}
        {currentAgentData &&
          <form>
            <div className="form-item">
              <span className="form-item-label">Dialogue:</span>
              <textarea className="form-text-area" onChange={(e) => { e.preventDefault(); currentAgentData.dialog = e.target.value }} defaultValue={currentAgentData.dialog}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Morals:</span>
              <textarea className="form-text-area" onChange={(e) => { e.preventDefault(); currentAgentData.morals = e.target.value }} defaultValue={currentAgentData.morals}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Facts:</span>
              <textarea className="form-text-area" onChange={(e) => { e.preventDefault(); currentAgentData.facts = e.target.value }} defaultValue={currentAgentData.facts}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Monologue:</span>

              <textarea className="form-text-area" onChange={(e) => { e.preventDefault(); currentAgentData.monologue = e.target.value }} defaultValue={currentAgentData.monologue}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Personality:</span>
              <textarea className="form-text-area" onChange={(e) => { e.preventDefault(); currentAgentData.personality = e.target.value }} defaultValue={currentAgentData.personality}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Relationship Matrix:</span>
              <textarea className="form-text-area" onChange={(e) => { e.preventDefault(); currentAgentData.relationshipMatrix = e.target.value }} defaultValue={currentAgentData.relationshipMatrix}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Greetings:</span>
              <textarea className="form-text-area" onChange={(e) => { e.preventDefault(); currentAgentData.startingPhrases = e.target.value }} defaultValue={currentAgentData.startingPhrases}></textarea>
            </div>

            <input type='button' value='Update' onClick={() => update()} />
            <input type='button' value='Delete' onClick={() => {
              deleteAgent(currentAgentData.agentName);
            }} />
          </form>
        }
      </div>
    </div>
  );
};

export default AIEditor;
