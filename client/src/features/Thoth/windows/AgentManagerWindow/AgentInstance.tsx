//@ts-nocheck

import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function isJson(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

function capitalizeFirstLetter(word) {
  if (!word || word === undefined) word = ''
  return word.charAt(0).toUpperCase() + word.slice(1)
}

const Agent = ({ id, updateCallback }) => {
  const [loaded, setLoaded] = useState(false)

  const [instanceId, setInstanceId] = useState(-1)
  const [enabled, setEnabled] = useState(false)
  const [personality, setPersonality] = useState('')
  const [discord_enabled, setdiscord_enabled] = useState(false)
  const [discord_api_key, setDiscordApiKey] = useState('')

  useEffect(() => {
    if (!loaded) {
      (async () => {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/agentInstance?instanceId=` + id
        )
        console.log("res is", res)
        setPersonality(res.data.personality)
        setInstanceId(res.data.instanceId)
        setEnabled(res.data.enabled === true || res.data.enabled === 'true')
        setdiscord_enabled(res.data.discord_enabled === true && res.data.discord_enabled === 'true')
        setDiscordApiKey(res.data.discord_api_key)
        setLoaded(true)
      })()
    }
  }, [loaded])

  const _delete = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/agentInstance`, {
        instanceId,
      })
      .then(res => {
        updateCallback()
      })
  }

  const update = () => {
    console.log("Update called")
    const _data = {
      personality,
      enabled,
      discord_enabled,
      discord_api_key
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/agentInstance`, { id: instanceId, data: _data })
      .then(res => {
        console.log("response on update", res)
        setEnabled(res.renabled)
        setPersonality(res.personality)
        setdiscord_enabled(res.discord_enabled)
        setDiscordApiKey(res.discord_api_key)
        // updateCallback()
      })
  }

  return !loaded ? <>Loading...</> : (
    <div>
      <div className="form-item">
        <span className="form-item-label">Enabled</span>
        <input
          type="checkbox"
          defaultChecked={enabled}
          onChange={e => {
            setEnabled(e.target.checked)
          }}
        />
      </div>

      <div className="form-item">
        <span className="form-item-label">Personality</span>
        <input
          type="text"
          defaultValue={personality}
          onChange={e => setPersonality(e.target.value)}
        />
      </div>

      <div className="form-item">
        <span className="form-item-label">Instance ID</span>
        <input
          type="text"
          defaultValue={instanceId}
          onChange={e => {
            setInstanceId(e.target.value)
          }}
        />
      </div>

      <div className="form-item">
        <span className="form-item-label">Discord Enabled</span>
        <input
          type="checkbox"
          defaultChecked={discord_enabled}
          onChange={e => {
            setdiscord_enabled(e.target.checked)
          }}
        />
      </div>

      {discord_enabled && (
        <div className="form-item">
          <span className="form-item-label">Discord API Key</span>
          <input
            type="text"
            defaultValue={discord_api_key}
            onChange={e => {
              setDiscordApiKey(e.target.value)
            }}
          />
        </div>
      )}

      <div className="form-item">
        <button onClick={() => update()}>Update</button>
        <button onClick={() => _delete()}>Delete</button>
      </div>
    </div>
  )
}

export default Agent
