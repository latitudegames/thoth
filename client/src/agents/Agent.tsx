//@ts-nocheck

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function capitalizeFirstLetter(word) {
    if (!word || word === undefined) word = '';
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const Agent = ({ id, updateCallback }) => {
    const [data, setData] = useState([]);
    const [personality, setPersonality] = useState('');
    const [instanceId, setInstanceId] = useState('1');
    const [enabled, setEnabled] = useState(false);

    useEffect(async () => {
        setEnabled(false);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/agentInstance?instanceId=` + id);
        console.log("res.data.clients", res.data.clients);
        const d = res.data.clients ?? [];
        const _data = []
        for (let i = 0; i < d.length; i++) {
            _data.push(d[i]);
        }
        setData(_data);
        setPersonality(res.data.personality);
        setInstanceId(res.data.id);
        setEnabled(res.data.enabled === 'true');
    }, [])

    const _delete = () => {
        console.log("deleting")
        axios.delete(`${process.env.REACT_APP_API_URL}/agentInstance`, {
            instanceId
        }).then(res => {
            updateCallback();
        });
    }

    const update = () => {
        const _data = {
            id: instanceId,
            personality: personality,
            clients: data,
            enabled: enabled
        };
        axios.post(`${process.env.REACT_APP_API_URL}/agentInstance`, { data: _data }).then(res => {
            updateCallback();
        });
    }

    function FormItem({ idx, value }) {
        return (
            <div key={idx} >
                <input type='checkbox' defaultChecked={value.enabled == 'true'} onChange={(e) => {
                    const d = { ...data } as any
                    d[idx]['enabled'] = e.target.checked.toString()
                    setData(d);
                }}></input>

                <span className="form-item-label">{capitalizeFirstLetter(value.client)}</span>

                {
                    value.settings.map((v2, idx2) => {
                        return (
                            <div key={idx2} >
                                <span className="form-item-label">{v2.name}</span>
                                <textarea defaultValue={v2.value} onChange={(e) => { (data[idx] as any).settings[idx2] = { name: v2.name, value: e.target.value } }} />
                            </div>
                        )
                    }

                    )}
            </div>
        )
    }

    return (
        <div>
            <div className="form-item">
                <span className="form-item-label">Enabled</span>
                <input type='checkbox' defaultChecked={enabled} onChange={(e) => {
                    setEnabled(e.target.checked)
                }} />
            </div>

            <div className="form-item">
                <span className="form-item-label">Personality</span>
                <input type='text' defaultValue={personality} onChange={(e) => setPersonality(e.target.value)} />
            </div>

            <div className="form-item">
                <span className="form-item-label">Instance ID</span>
                <input type='text' defaultValue={instanceId} onChange={(e) => { setInstanceId(e.target.value); request(e.target.value) }} />
            </div>

            <div className="form-item">
                <button onClick={() => update()}>Update</button>
                <button onClick={() => _delete()}>Delete</button>
            </div>


            {enabled && data.map((value, idx) => {
                return <FormItem key={idx} value={value} idx={idx} />
            })}
        </div>
    )
}

export default Agent;
