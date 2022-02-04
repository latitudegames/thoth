import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Prompts = () => {
    const [firstLoad, setFirstLoad] = useState(true);
    const [dataUpdated, setDataUpdated] = useState(false);
    const [data, setData] = useState({});
    const navigate = useNavigate();

    if (firstLoad) {
        axios.get(`${process.env.REACT_APP_API_URL}/prompts`).then(res => {
            setData(res.data);
            setFirstLoad(false);
        });
    }

    const update = async () => {
        axios.post(`${process.env.REACT_APP_API_URL}/prompts`, { data: data }).then(res => {
            if (res.data === 'ok') {
                navigate('/');
            } else {
                console.log(res.data);
            }
        });
    }

    return (
        <div className="agent-editor">
            Prompts
            {firstLoad ? (
                <h1>Loading...</h1>
            ) : (
                <div>
                    <form>
                        <div className="form-item">
                            <span className="form-item-label">3D World Understanding Prompt</span>
                            <textarea style={{ height: 100, width: 800 }} onChange={(e) => { setDataUpdated(true); data.xr_world = e.target.value }} defaultValue={data.xr_world}></textarea>
                        </div>
                        <div className="form-item">
                            <span className="form-item-label">Fact Summarization Prompt</span>
                            <textarea style={{ height: 100, width: 800 }} onChange={(e) => { setDataUpdated(true); data.fact = e.target.value }} defaultValue={data.fact}></textarea>
                        </div>
                        <div className="form-item">
                            <span className="form-item-label">Opinion Form Prompt</span>
                            <textarea style={{ height: 100, width: 800 }} onChange={(e) => { setDataUpdated(true); data.opinion = e.target.value }} defaultValue={data.opinion}></textarea>
                        </div>
                        <div className="form-item">
                            <span className="form-item-label">XREngine Room Prompt</span>
                            <textarea style={{ height: 100, width: 800 }} onChange={(e) => { setDataUpdated(true); data.xr = e.target.value }} defaultValue={data.xr}></textarea>
                        </div>

                        <input type='button' value='Update' onClick={update} />
                    </form>
                </div>
            )}
        </div>
    );
};

export default Prompts;
