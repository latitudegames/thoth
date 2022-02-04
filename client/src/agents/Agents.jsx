import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Agent from "./Agent";

const Agents = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const createNew = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/agentInstance`, { data: {} }).then(res => {
            if (res.data === 'ok') {
                navigate('/');
            } else {
                console.log(res.data);
            }
        });
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/agentInstances`).then(res => {
            console.log("res is", res);
            setData(res.data);
        });
    }, [])

    return (

        <div className="agent-editor">
            Agents
            <div>
                {data && data.map((value, idx) => {
                    return (
                        <Agent id={value.id} key={idx} />
                    )
                })}
            </div>


            <button onClick={() => createNew()}>Create New</button>

        </div>
    )
}

export default Agents;
