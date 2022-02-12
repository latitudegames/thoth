//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useState } from 'react'

import AgentInstance from './AgentInstance'

const AgentInstances = () => {
  const [data, setData] = useState([])
  const [currentInc, setInc] = useState(0)

  const createNew = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/agentInstance`, { data: {} })
      .then(res => {
        setInc(currentInc + 1)
      })
  }

  useEffect(async () => {
    const res = await axios.get(`${process.env.REACT_APP_API_URL}/agentInstances`);
    setData(res.data);
  }, [])

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/agentInstances`).then(res => {
      setData(res.data)
    })
  }, [currentInc])

  return (
    <div className="agent-editor">
      Agent Instances

      <React.Fragment>
        <div>
          {data &&
            data.map((value, idx) => {
              return (
                <AgentInstance
                  id={value.id}
                  key={idx}
                  updateCallback={() => setInc(currentInc + 1)}
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
