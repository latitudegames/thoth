//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useState } from 'react'

import Ent from './EntWindow'

const Ents = () => {
  const [data, setData] = useState(false)

  const resetData = async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/agentInstances`);
    console.log("res is ", res)
    setData(res.data);
  }

  const createNew = () => {
    console.log("Create new called")
    axios
      .post(`${process.env.REACT_APP_API_ROOT_URL}/agentInstance`, { data: {} })
      .then(async res => {
        console.log("response is", res)
        const res = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/agentInstances`);
        setData(res.data);
      })
  }

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/agentInstances`);
      setData(res.data);
      console.log("set the data", res.data)
    })()
  }, [])

  return (
    <div className="agent-editor">
      <React.Fragment>
        <div>
          {data && data !== [] &&
            data.map((value, idx) => {
              return (
                <Ent
                  id={value.id}
                  key={idx}
                  updateCallback={async () => {
                    resetData();
                  }}
                />
              )
            })}
        </div>
      </React.Fragment>

      <button onClick={() => createNew()}>Create New</button>
    </div>
  )
}

export default Ents
