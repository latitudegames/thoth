import axios from "axios";
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const AgentsConfigEditor = () => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [config, setConfig] = useState({});
  const [dataUpdated, setDataUpdated] = useState(false);
  const navigate = useNavigate();

  if (firstLoad) {
    axios.get(`${process.env.REACT_APP_API_URL}/agentConfig`).then(res => {
      setConfig(res.data);
      setFirstLoad(false);
    });
  }

  const update = async () => {
    if (!dataUpdated) {
      return;
    }

    const body = { data: config };
    axios.post(`${process.env.REACT_APP_API_URL}/agentConfig`, body).then(res => {
      if (res.data === 'ok') {
        navigate('/');
      } else {
        console.log(res.data);
      }
    });
  }

  return (
    <div className="App">
      <div>
        <button><Link to="/" className="btn btn-primary">back</Link></button>
        {firstLoad ? (
          <h1>Loading...</h1>
        ) : (
          <div>
            <h1>Config:</h1>
            <form>
              <div className="form-item">
                <span className="form-item-label">Default Agent:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.defaultAgent = e.target.value }} defaultValue={config.defaultAgent}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Use Profanity Filter:</span>
                <input type='checkbox' defaultChecked={config.useProfanityFilter == 'true' ? true : false} onChange={(e) => { setDataUpdated(true); config.useProfanityFilter = e.target.checked.toString() }}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Content Rating:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.contentRating = e.target.value }} defaultValue={config.contentRating}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Filter Sensititive:</span>
                <input type='checkbox' defaultChecked={config.filterSensitive == 'true' ? true : false} onChange={(e) => { setDataUpdated(true); config.filterSensitive = e.target.checked.toString() }}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Facts Update Interval:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.factsUpdateInterval = e.target.value }} defaultValue={config.factsUpdateInterval}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Conversation Window Size:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.conversationWindowSize = e.target.value }} defaultValue={config.conversationWindowSize}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Active Conversation Size:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.activeConversationSize = e.target.value }} defaultValue={config.activeConversationSize}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Speaker Facts Window Size:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.speakerFactsWindowSize = e.target.value }} defaultValue={config.speakerFactsWindowSize}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Agent Facts Window Size:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.agentFactsWindowSize = e.target.value }} defaultValue={config.agentFactsWindowSize}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Dialogue Frequency Penalty:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.dialogFrequencyPenality = e.target.value }} defaultValue={config.dialogFrequencyPenality}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Dialogue Presence Penalty:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.dialogPresencePenality = e.target.value }} defaultValue={config.dialogPresencePenality}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Sumarization Model:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.summarizationModel = e.target.value }} defaultValue={config.summarizationModel}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Conversation Model:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.conversationModel = e.target.value }} defaultValue={config.conversationModel}></input>
              </div>
              <div className="form-item">
                <span className="form-item-label">Opinion Model:</span>
                <input type='text' onChange={(e) => { setDataUpdated(true); config.opinionModel = e.target.value }} defaultValue={config.opinionModel}></input>
              </div>

              <input type='button' value='Update' onClick={update} />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsConfigEditor;
