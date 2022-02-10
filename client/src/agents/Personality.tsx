//@ts-nocheck

import axios from 'axios';
import React, { useState } from 'react';

const Personality = ({ data, handleClick }) => {
    const [dataUpdated, setDataUpdated] = useState(false);

    const update = async () => {
        if (!dataUpdated) {
            return;
        }

        const body = { agentName: data.agentName, data: data };
        axios.post(`${process.env.REACT_APP_API_URL}/update_agent`, body).then(res => {
            if (res.data === 'ok') {
                handleClick();
            } else {
                console.log(res.data);
            }
        });
    }

    return (
        <div style={{ minWidth: "80%" }}>
            <form>
                <h2>Agent: {data.agentName}</h2>
                <div className="form-item">
                    <span className="form-item-label">Personalities:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.actions = e.target.value }} defaultValue={data.actions}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Dialogue:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.dialogue = e.target.value }} defaultValue={data.dialogue}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Ethics:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.ethics = e.target.value }} defaultValue={data.ethics}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Facts:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.facts = e.target.value }} defaultValue={data.facts}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Monologue:</span>

                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.monologue = e.target.value }} defaultValue={data.monologue}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Needs and Motivations:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.needsAndMotivation = e.target.value }} defaultValue={data.needsAndMotivation}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Personality:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.personality = e.target.value }} defaultValue={data.personality}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Relationship Matrix:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.relationshipMatrix = e.target.value }} defaultValue={data.relationshipMatrix}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Room:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.room = e.target.value }} defaultValue={data.room}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Starting Phrases:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.startingPhrases = e.target.value }} defaultValue={data.startingPhrases}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Ignored Keywords:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.ignoredKeywords = e.target.value }} defaultValue={data.ignoredKeywords}></textarea>
                </div>

                <div className="form-item">
                    <span className="form-item-label">Ignored Keywords:</span>
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); data.agentsConfig = e.target.value }} defaultValue={data.agentsConfig}></textarea>
                </div>

                <input type='button' value='Update' onClick={update} />
                <input type='button' value='Delete' onClick={() => {
                    axios.post(`${process.env.REACT_APP_API_URL}/delete_agent`, { agentName: data.agentName }).then(res => {
                        handleClick();
                    });
                }} />
            </form>
        </div>
    );
};

export default Personality;
