import axios from "axios";
import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";

const ConfigEditor = () => {
  const [firstLoad, setFirstLoad] = useState(true);
  const [config, setConfig] = useState(null);
  const [dataUpdated, setDataUpdated] = useState(false);
  const [newConfig, setNewConfig] = useState({ key: '', value: '' });
  const navigate = useNavigate();

  if (firstLoad) {
    axios.get(`${process.env.REACT_APP_API_URL}/config`).then(res => {
      setConfig(res.data.config);
      setFirstLoad(false);
    });
  }

  const update = async () => {
    if (!dataUpdated) {
      console.log('data is the same');
      return;
    }

    const body = { config: config };
    axios.put(`${process.env.REACT_APP_API_URL}/config`, body).then(res => {
      if (res.data === 'ok') {
        navigate('/');
      } else {
        console.log(res.data);
      }
    });
  }

  const _delete = async (key) => {
    const body = { data: { key: key } };
    axios.delete(`${process.env.REACT_APP_API_URL}/config`, body).then(res => {
      if (res.data === 'ok') {
        navigate('/');
      } else {
        console.log(res.data);
      }
    });
  }

  const add = async () => {
    if (newConfig.key === '' || newConfig.value === '') {
      return;
    }

    const body = { data: { key: newConfig.key, value: newConfig.value } };
    axios.post(`${process.env.REACT_APP_API_URL}/config`, body).then(res => {
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
    <div className="App">
      <div>
        {firstLoad ? (
          <h1>Loading...</h1>
        ) : (
          <div>
            <h1>Config:</h1>
            <label>Add new Config Variable:<br />
              <label>Key:
                <input type="text" name="new_config_variable_key" onChange={(e) => {
                  newConfig.key = e.target.value;
                }} defaultValue='' />
              </label>
              <br />
              <label>Value:
                <input type="text" name="new_config_variable_value" onChange={(e) => {
                  newConfig.value = e.target.value;
                }} defaultValue='' />
              </label>
              <br />
              <button onClick={() => {
                add();
              }}>Add</button>
            </label>
            {config.map((value, idx) => {
              return (
                <div
                  key={idx}
                >
                  <label>{value.key}:
                    {(value.value.length > 0 && (value.value.toLowerCase() === 'true' || value.value.toLowerCase() === 'false')) ? (
                      <input type='checkbox' id={idx} name={idx} defaultChecked={value.value.toLowerCase().trim() == 'true' ? true : false} onChange={(e) => {
                        setDataUpdated(true); config[idx] = { key: value.key, value: (e.target.checked.toString()) }
                      }} />
                    ) : (
                      <textarea onChange={(e) => { setDataUpdated(true); config[idx] = { key: value.key, value: e.target.value } }} defaultValue={value.value}></textarea>
                    )}
                    <button onClick={() => { _delete(value.key) }}>delete</button>
                  </label><br /><br />
                </div>
              );
            })}
            <input type='button' value='Update' onClick={update} />
          </div>
        )}

      </div>
    </div>
  );
};

export default ConfigEditor;
