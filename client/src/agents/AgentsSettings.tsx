//@ts-nocheck

import axios from "axios";
import React, { useState } from 'react';

const confDefaults = {
    useProfanityFilter: 'false',
    contentRating: 'false',
    filterSensitive: 'false',
    factsUpdateInterval: '2',
    agentFactsWindowSize: '4',
    conversationWindowSize: '10',
    activeConversationSize: '10',
    speakerFactsWindowSize: '4',
    dialogFrequencyPenality: '.3',
    dialogPresencePenality: '.3',
    summarizationModel: 'davinci',
    conversationModel: 'davinci',
    opinionModel: 'davinci'
}

const AgentsSettings = () => {
    const [firstLoad, setFirstLoad] = useState(true);
    const [config, setConfig] = useState(confDefaults);
    const [dataUpdated, setDataUpdated] = useState(false);

    if (firstLoad) {
        axios.get(`${process.env.REACT_APP_API_URL}/agentConfig`).then(res => {
            setConfig(res.data);
            setFirstLoad(false);
        });
    }

    const update = async () => {
        if (!dataUpdated) {
            console.log('data is the same');
            return;
        }

        const body = { data: config };
        axios.post(`${process.env.REACT_APP_API_URL}/agentConfig`, body).then(res => {
            console.log(res.data);
        });
    }

    return (
        <div className="App">
            <div>
                {firstLoad ? (
                    <h1>Loading...</h1>
                ) : (
                    <div>
                        <h1>Config:</h1>
                        <form>
                            <div className="form-item">
                                <span className="form-item-label">Use Profanity Filter:</span>
                                <input type='checkbox' defaultChecked={config.useProfanityFilter === 'true' ? true : false} onChange={(e) => { setDataUpdated(true); config.useProfanityFilter = e.target.checked.toString() }}></input>
                            </div>
                            <div className="form-item">
                                <span className="form-item-label">Content Rating:</span>
                                <input type='text' onChange={(e) => { setDataUpdated(true); config.contentRating = e.target.value }} defaultValue={config.contentRating}></input>
                            </div>
                            <div className="form-item">
                                <span className="form-item-label">Filter Sensititive:</span>
                                <input type='checkbox' defaultChecked={config.filterSensitive === 'true' ? true : false} onChange={(e) => { setDataUpdated(true); config.filterSensitive = e.target.checked.toString() }}></input>
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

export default AgentsSettings;