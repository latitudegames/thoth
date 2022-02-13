//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useState } from 'react'

import AgentInstance from './AgentInstance'

const AgentInstances = () => {
  const [data, setData] = useState(false)

  const createNew = () => {
    console.log("Create new called")
    axios
      .post(`${process.env.REACT_APP_API_URL}/agentInstance`, { data: {} })
      .then(async res => {
        console.log("response is", res)
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/agentInstances`);
        setData(res.data);
      })
  }

  useEffect(() => {
    (async () => {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/agentInstances`);
      setData(res.data);
      console.log("set the data")
    })()
  }, [])

  return (
    <div className="agent-editor">
      Agent Instances

      <React.Fragment>
        <div>
          {data && data !== [] &&
            data.map((value, idx) => {
              return (
                <AgentInstance
                  id={value.id}
                  key={idx}
                  updateCallback={async () => {
                    setData((await axios.get(`${process.env.REACT_APP_API_URL}/agentInstances`)).data);
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

export default AgentInstances
