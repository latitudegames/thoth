import axios from 'axios';
import React, { useState } from 'react';

const NewAgentEditor = ({ handleClick }) => {
    const [agentData, setAgentData] = useState({});

    const showFile = async (e) => {
        e.preventDefault()
        const reader = new FileReader()
        reader.onload = async (e) => {
            const body = { sql: (e.target.result) };
            axios.post(`${process.env.REACT_APP_API_URL}/create_agent_sql`, body).then(res => {
                if (res.data === 'ok') {
                    handleClick();
                } else {
                    console.console.error(error);
                }
            });
        };
        reader.readAsText(e.target.files[0])
    }

    const update = async () => {
        if (agentData.agentName === undefined || !agentData.agentName || agentData.agentName.length <= 0) {
            return;
        }

        const body = { data: agentData };
        axios.post(`${process.env.REACT_APP_API_URL}/create_agent`, body).then(res => {
            if (res.data === 'ok') {
                handleClick();
            } else {
                console.log(res.data);
            }
        });
    }

    return (
        <div>
            <center>
                <label>Import agent through SQL:
                    <input type="file" onChange={(e) => showFile(e)} />
                </label>
                <br /><br />
                <p>Or fill this form:</p>
                <form>
                    <label>Name:
                        <textarea onChange={(e) => { agentData.agentName = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Actions:
                        <textarea onChange={(e) => { agentData.actions = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Dialogue:
                        <textarea onChange={(e) => { agentData.dialogue = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Ethics:
                        <textarea onChange={(e) => { agentData.ethics = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Facts:
                        <textarea onChange={(e) => { agentData.facts = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Monologue:
                        <textarea onChange={(e) => { agentData.monologue = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Needs and Motivations:
                        <textarea onChange={(e) => { agentData.needsAndMotivation = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Personality:
                        <textarea onChange={(e) => { agentData.personality = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Relationship Matrix:
                        <textarea onChange={(e) => { agentData.relationshipMatrix = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Room:
                        <textarea onChange={(e) => { agentData.room = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Starting Phrases:
                        <textarea onChange={(e) => { agentData.startingPhrases = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Ignored Keywords:
                        <textarea onChange={(e) => { agentData.ignoredKeywords = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <label>Agent's Config:
                        <textarea onChange={(e) => { agentData.agentsConfig = e.target.value }} defaultValue=''></textarea>
                    </label><br /><br />
                    <input type='button' value='Add' onClick={update} />
                </form>
            </center>
        </div>
    );
};

export default NewAgentEditor;
