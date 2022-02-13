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

const Ent = ({ id, updateCallback }) => {
  const [loaded, setLoaded] = useState(false)

  const [enabled, setEnabled] = useState(false)
  const [agent, setAgent] = useState('')
  const [discord_enabled, setdiscord_enabled] = useState(false)
  const [discord_api_key, setDiscordApiKey] = useState('')
  const [discord_spell_handler, setDiscordSpellHandler] = useState('')

  useEffect(() => {
    if (!loaded) {
      (async () => {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/agentInstance?instanceId=` + id
        )
        console.log("res is", res)
        setAgent(res.data.personality)
        setEnabled(res.data.enabled === true)
        setdiscord_enabled(res.data.discord_enabled === true)
        setDiscordApiKey(res.data.discord_api_key)
        setDiscordSpellHandler(res.data.discord_spell_handler)
        setLoaded(true)
      })()
    }
  }, [loaded])

  const _delete = () => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/agentInstance/` + id)
      .then(res => {
        console.log("deleted", res)
        setLoaded(false)
        updateCallback()
      })
  }

  const update = () => {
    console.log("Update called")
    const _data = {
      personality: agent,
      enabled,
      discord_enabled,
      discord_api_key,
      discord_spell_handler
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/agentInstance`, { id, data: _data })
      .then(res => {
        console.log("response on update", res)
        setEnabled(res.enabled)
        setAgent(res.personality)
        setdiscord_enabled(res.discord_enabled)
        setDiscordApiKey(res.discord_api_key)
        setDiscordSpellHandler(res.discord_spell_handler)
        updateCallback()
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
      {enabled && <>


        <div className="form-item">
          <span className="form-item-label">Agent Template</span>
          <input
            type="text"
            defaultValue={agent}
            onChange={e => setAgent(e.target.value)}
          />
        </div>

        <div className="form-item">
          <span className="form-item-label">Discord Enabled</span>
          <input
            type="checkbox"
            value={discord_enabled}
            defaultChecked={discord_enabled || discord_enabled === 'true'}
            onChange={e => {
              setdiscord_enabled(e.target.checked)
            }}
          />
        </div>

        {discord_enabled && (
          <>
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
            <div className="form-item">
              <span className="form-item-label">SpellHandler</span>
              <input
                type="text"
                defaultValue={discord_spell_handler}
                onChange={e => {
                  setDiscordSpellHandler(e.target.value)
                }}
              />
            </div>
          </>
        )}
      </>}
      <div className="form-item">
        <button onClick={() => update()}>Update</button>
        <button onClick={() => _delete()}>Delete</button>
      </div>
    </div>
  )
}

export default Ent
