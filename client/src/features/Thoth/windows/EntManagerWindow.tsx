import axios from 'axios'
import React, { useEffect, useState } from 'react'

import Ent from './EntWindow'

const Ents = () => {
  const [data, setData] = useState(false)

  const resetData = async () => {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/agentInstances`
    )
    setData(res.data)
  }

  const createNew = () => {
    axios
      .post(`${process.env.REACT_APP_API_URL}/agentInstance`, { data: {} })
      .then(async res => {
        const res2 = await axios.get(
          `${process.env.REACT_APP_API_URL}/agentInstances`
        )
        setData(res2.data)
      })
  }

  useEffect(() => {
    ;(async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/agentInstances`
      )
      setData(res.data)
    })()
  }, [])

  return (
    <div className="agent-editor">
      <React.Fragment>
        <div>
          {data &&
            data !== [] &&
            data.map((value, idx) => {
              return (
                <Ent
                  id={value.id}
                  key={idx}
                  updateCallback={() => {
                    resetData()
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
