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

const Agent = ({ id }) => {
    const [data, setData] = useState([]);
    const [personality, setPersonality] = useState('');
    const [instanceId, setInstanceId] = useState('1');
    const [enabled, setEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(async () => {
        setEnabled(false);
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/agentInstance?instanceId=` + id);

        const d = isJson(res.data.clients) ? JSON.parse(res.data.clients) : res.data.clients;
        const _data = []
        _data.splice(0, _data.length);
        for (let i = 0; i < d.length; i++) {
            _data.push(d[i]);
        }
        setData(_data);
        setPersonality(res.data.personality);
        setInstanceId(res.data.id);
        setEnabled(res.data.enabled === 'true');
    }, [])

    const _delete = () => {
        axios.get(`${process.env.REACT_APP_API_URL}/delete_agent_instance?instanceId=` + instanceId).then(res => {
            if (res.data === 'ok') {
                navigate('/');
            } else {
                console.log(res.data);
            }
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
            if (res.data === 'ok') {
                navigate('/');
            } else {
                console.log(res.data);
            }
        });
    }

    function FormItem({ idx, value }) {
        return (
            <div key={idx} >
                <input type='checkbox' defaultChecked={value.enabled == 'true'} onChange={(e) => {
                    data[idx].enabled = e.target.checked.toString()
                }}></input>

                <span className="form-item-label">{capitalizeFirstLetter(value.client)}</span>

                {
                    value.settings.map((v2, idx2) => {
                        return (
                            <div key={idx2} >
                                <span className="form-item-label">{v2.name}</span>
                                <textarea defaultValue={v2.value} onChange={(e) => { data[idx].settings[idx2] = { name: v2.name, value: e.target.value } }} />
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
                return <FormItem key={idx} value={value} />
            })}
        </div>
    )
}

export default Agent;
