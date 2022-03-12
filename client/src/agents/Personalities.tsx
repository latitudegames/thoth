//@ts-nocheck

import axios from "axios";
import React, { useEffect, useState } from 'react';

const AIEditor = () => {
  const [agents, setAgents] = useState();
  const [currentAgentData, setCurrentAgentData] = useState(null);

  const [dataUpdated, setDataUpdated] = useState(false);

  const update = async () => {
    if (!dataUpdated) {
      return;
    }

    const body = { agentName: currentAgentData.agentName, data: currentAgentData };
    axios.post(`${process.env.REACT_APP_API_ROOT_URL}/agent`, body).then(res => {
      if (res.data === 'ok') {
        handleClick();
      } else {
        console.log(res.data);
      }
    });
  }

  useEffect(() => {
    if (!agents) {
      axios.get(`${process.env.REACT_APP_API_ROOT_URL}/agents`).then(res => {
        if (res.data.length == 0) return setAgents([]);
        let newAgents = [];
        for (let i = 0; i < res.data.length; i++) {
          newAgents.push(res.data[i]);
        }
        console.log("newAgents", newAgents);
        setAgents(newAgents);

        axios.get(`${process.env.REACT_APP_API_ROOT_URL}/agent?agent=${newAgents[0]}`).then(res => {
          res.data.agentName = newAgents[0];
          setCurrentAgentData(res.data);
          console.log("currentAgentData: ", currentAgentData)
          console.log("agents", agents);
        });
      });
    }
  }, [agents])

  const handleClick = (e) => { e.preventDefault(); setCurrentAgentData(null) };

  return (
    <div className="App">
      <div>
        {!agents ? (
          <h1>Loading...</h1>
        ) : (
          <div className="agent-header">
            <h2>Personality: {currentAgentData ? currentAgentData.agentName : "Loading..."}</h2>
            <span className="agent-select">
              <select name="agents" id="agents" onChange={(event) => {
                const agent = agents[event.target.options.selectedIndex];
                setCurrentAgentData(null);
                axios.get(`${process.env.REACT_APP_API_ROOT_URL}/get_agent?agent=${agent}`).then(res => {
                  res.data.agentName = agent;
                  setCurrentAgentData(res.data);
                });
              }}>
                {agents.length > 0 && agents.map((agent, idx) =>
                  <option value={agent} key={idx}>{agent}</option>
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
              <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); currentAgentData.dialogue = e.target.value }} defaultValue={currentAgentData.dialogue}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Morals:</span>
              <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); currentAgentData.morals = e.target.value }} defaultValue={currentAgentData.morals}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Facts:</span>
              <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); currentAgentData.facts = e.target.value }} defaultValue={currentAgentData.facts}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Monologue:</span>

              <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); currentAgentData.monologue = e.target.value }} defaultValue={currentAgentData.monologue}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Needs and Motivations:</span>
              <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); currentAgentData.needsAndMotivation = e.target.value }} defaultValue={currentAgentData.needsAndMotivation}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Personality:</span>
              <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); currentAgentData.personality = e.target.value }} defaultValue={currentAgentData.personality}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Relationship Matrix:</span>
              <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); currentAgentData.relationshipMatrix = e.target.value }} defaultValue={currentAgentData.relationshipMatrix}></textarea>
            </div>

            <div className="form-item">
              <span className="form-item-label">Greetings:</span>
              <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); currentAgentData.startingPhrases = e.target.value }} defaultValue={currentAgentData.startingPhrases}></textarea>
            </div>

            <input type='button' value='Update' onClick={update} />
            <input type='button' value='Delete' onClick={() => {
              axios.delete(`${process.env.REACT_APP_API_ROOT_URL}/agent`, { agentName: currentAgentData.agentName }).then(res => {
                handleClick();
              });
            }} />
          </form>
        }
      </div>
    </div>
  );
};

export default AIEditor;
