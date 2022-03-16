//@ts-nocheck

import axios from "axios";
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const ConfigManager = () => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [config, setConfig] = useState(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [newConfig, setNewConfig] = useState({ key: '', value: '' });
  const navigate = useNavigate();

  if (firstLoad) {
    axios.get(`${process.env.REACT_APP_API_ROOT_URL}/config`).then(res => {
      setConfig(res.data);
      setFirstLoad(false);
    });
  }

  const update = async () => {
    if (!dataUpdated) {
      console.log('data is the same');
      return;
    }

    const body = { config: config };
    axios.put(`${process.env.REACT_APP_API_ROOT_URL}/config`, body).then(res => {
      console.log(res.data);
    });
  }

  const _delete = async (key) => {
    axios.delete(`${process.env.REACT_APP_API_ROOT_URL}/config/` + key).then(res => {
      console.log(res.data);
    });
  }

  const add = async () => {
    if (newConfig.key === '' || newConfig.value === '') {
      return;
    }

    const body = { data: { key: newConfig.key, value: newConfig.value } };
    axios.post(`${process.env.REACT_APP_API_ROOT_URL}/config`, body).then(res => {
      if (res.data === 'ok') {
        navigate('/');
      } else {
        console.log(res.data);
      }
    });
    newConfig.key = '';
    newConfig.value = '';
  }

  return (
    <div className="agent-container">
      <div>
        {firstLoad ? (
          <h1>Loading...</h1>
        ) : (
          <div>
            <label>Add new Config Variable:<br />
              <label>Key:
                <input className="form-item" type="text" name="new_config_variable_key" onChange={(e) => {
                  newConfig.key = e.target.value;
                }} defaultValue='' />
              </label>
              <br />
              <label>Value:
                <input className="form-item" type="text" name="new_config_variable_value" onChange={(e) => {
                  newConfig.value = e.target.value;
                }} defaultValue='' />
              </label>
              <br />
              <button onClick={() => {
                add();
              }}>Add</button>
            </label>
            {config && config.length > 0 && config.map((value, idx) => {
              return (
                <div
                  key={idx}
                  className="form-item"
                >
                  <span className="form-item-label">{value.key}</span>
                  {(value.value && value.value.length > 0 && (value.value.toLowerCase() === 'true' || value.value.toLowerCase() === 'false')) ? (
                    <input type='checkbox' id={idx} name={idx} defaultChecked={value.value.toLowerCase().trim() == 'true' ? true : false} onChange={(e) => {
                      setDataUpdated(true); config[idx] = { key: value.key, value: (e.target.checked.toString()) }
                    }} />
                  ) : (
                    <textarea className="form-text-area" onChange={(e) => { setDataUpdated(true); config[idx] = { key: value.key, value: e.target.value } }} defaultValue={value.value}></textarea>
                  )}
                  <button className="button" onClick={() => { console.log("value is", value); _delete(value.id) }}>Delete</button>
                </div>
              );
            })}
            <button className="button" type='button' value='Update' onClick={update}>Update</button>
          </div>
        )}

      </div>
    </div>
  );
};

export default ConfigManager;
