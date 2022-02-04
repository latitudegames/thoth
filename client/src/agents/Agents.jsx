import axios from 'axios';
import React, { useEffect, useState } from 'react';

import Agent from "./Agent";

const Agents = () => {
    const [data, setData] = useState([]);
    const [currentInc, setInc] = useState(0);

    const createNew = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/agentInstance`, { data: {} }).then(res => {
            setInc(currentInc + 1)
        });
    }

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/agentInstances`).then(res => {
            console.log("res is", res);
            setData(res.data);
        });
    }, [currentInc])

    return (
        <div className="agent-editor">
            {currentInc &&
                <React.Fragment>
                    Agents
                    <div>
                        {data && data.map((value, idx) => {
                            return (
                                <Agent id={value.id} key={idx} updateCallback={() => setInc(currentInc + 1)} />
                            )
                        })}
                    </div>
                </React.Fragment>
            }


            <button onClick={() => createNew()}>Create New</button>

        </div>
    )
}

export default Agents;
