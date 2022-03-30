//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useState } from 'react'

import EntityWindow from './EntityWindow'

const EntityManagerWindow = () => {
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
        const res2 = await axios.get(`${process.env.REACT_APP_API_ROOT_URL}/agentInstances`);
        setData(res2.data);
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
                <EntityWindow
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

export default EntityManagerWindow
